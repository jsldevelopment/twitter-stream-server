import * as AWS from 'aws-sdk'
import { TwitterApi, Tweetv2FieldsParams, TweetContextAnnotationV2 } from 'twitter-api-v2'
import 'dotenv/config'
import * as fs from 'fs'

// aws stuff below here ----------------
AWS.config.update({
    region: "us-east-1"
});

// dynamodb
const credentials = new AWS.SharedIniFileCredentials();
AWS.config.credentials = credentials;
export const dynamodb = new AWS.DynamoDB.DocumentClient();

interface ruleset {
    [key: number]: rule
}

interface rule {
    [key: string]: string
}

// study 131 - unified twitter taxonomy
// what is a vertical vs a category

// const ruleset: ruleset = {
//     1: {
//         '122': 'fictional character',
//         '130': 'multimedia franchise',
//         '71': 'video game',
//         '78': 'video game interest'
//     }
// }

const ruleset: ruleset = {
    // tv
    1: {
        '3': 'tv shows',
        '4': 'tv episodes',
        '22': 'tv genres',
        '23': 'tv channels',
        '172': 'global tv show',
        '86': 'movie',
        '87': 'movie genre',
        '95': 'tv channel [entity service]',
        '117': 'movie festival',
        '56': 'actor'
    },
    // politics
    2: {
        '29': 'events',
        '31': 'community',
        '35': 'politicians',
        '38': 'political race',
        '88': 'political body'
    },
    // video games
    3: {
        '115': 'video game conference',
        '116': 'video game tournament',
        '71': 'video game',
        '78': 'video game interest',
        '79': 'video game hardware',
        '136': 'video game personality',
    },
    // esports
    4: {
        '137': 'esports team',
        '138': 'esports player',
        '149': 'esports league'
    },
    // sports
    5: {
        '6': 'sports events',
        '11': 'sport',
        '12': 'sports teams',
        '26': 'sports league',
        '40': 'sports series',
        '92': 'sports personality',
        '60': 'athlete',
    },
    // sports 2
    6: {
        '27': 'american football game',
        '28': 'nfl football game',
        '44': 'baseball game',
        '39': 'basketball game',
        '68': 'hockey game',
        '83': 'cricket match'
    },
    // hobbies
    7: {
        '84': 'book',
        '85': 'book genre',
        '152': 'food',
        '174': 'digital assets & crypto',
        '164': 'fields of study',
        '165': 'technology',
        '166': 'stocks',
        '162': 'exercise & fitness',
        '163': 'travel'
    },
    // music
    8: {
        '89': 'music album',
        '90': 'radio station',
        '54': 'musician',
        '55': 'music genre',
        '114': 'concert',
    },
    // pop culture
    9: {
        '118': 'awards show',
        '122': 'fictional character',
        '130': 'multimedia franchise',
        '139': 'fan community',
        '109': 'reoccuring trends',
    },
    // pop culture 2
    10: {
        '58': 'entertainment personality',
        '91': 'podcast',
        '94': 'journalist',
        '110': 'viral accounts',
        '120': 'digital creator',
    },
    11: { 
        '155': 'weather',
        '156': 'cities',
        '157': 'colleges & universities',
        '158': 'points of interest',
        '159': 'states'
    },
    12: {
        '160': 'countries',
        '167': 'animals',
        '171': 'local news',
        '175': 'emergency events'
    }

}

// twitter api connections
const client = new TwitterApi(process.env.BEARER_TOKEN || "").v2.readOnly;

(async function start() {
    
    await updateRules()
    setInterval(updateRules, 10 * 60 * 1000)
    getStream()

}())

async function updateRules() {
    const data = fs.readFileSync('./temp.json', 'utf-8')
    const parsedData = JSON.parse(data)
    const nextRule = (Object.entries(ruleset).length === parsedData.currentRule) ? 1 : parsedData.currentRule+1
    const rules = await getRules()
    if (rules.length) {
        const ids = rules.map((rule) => {
            return rule.id
        })
        await deleteRules(ids)
    }
    await addRules(ruleset[nextRule])
    parsedData.currentRule = nextRule
    fs.writeFileSync('./temp.json', JSON.stringify(parsedData))
}

async function getRules() {
    const rules = await client.streamRules()
    return rules.data ? rules.data : []
}

async function addRules(rules: rule) {
    const rulesToAdd = []
    for (const [key, value] of Object.entries(rules)) {
        rulesToAdd.push({
            tag: value,
            value: `context:${key}.* -is:retweet -is:quote -is:reply -has:mentions lang:en`
        })
    }
    client.updateStreamRules({ add: rulesToAdd })
        .then((response) => {
            console.log(JSON.stringify(response))
        })
        .catch((err) => {
            console.log(err)
        })
}

async function deleteRules(rules: string[]) {

    client.updateStreamRules({ delete: { ids: rules } })
        .then(() => {
            console.log('rules deleted')
        })

} 

async function getStream() {
    console.log('getting stream')
    try {
        const stream = await client.searchStream({
            "tweet.fields": ['author_id', 'id', 'context_annotations', 'possibly_sensitive', 'created_at']
        })
    
        for await (let item of stream) {

            try {
                console.log('item found')
                if (item.data.text.length >= 180 && !item.data.possibly_sensitive ) {

                    let entities: string[] = []
                    item.data.context_annotations.forEach((item: TweetContextAnnotationV2) => {
                        if (!entities.includes(item.entity.id)) entities.push(item.entity.id)
                    })

                    console.log('writing enity to db')
                    entities.forEach((entity) => {
        
                        writeToDb({
                            entity: entity,
                            author: item.data.author_id,
                            tweet: item.data.id
                        })

                    })     
                }
            } catch (err) {
                console.log(err)
            }
        }
    } catch (err) {
        console.log(err)
    }
}

async function writeToDb(data) {

    console.log(data)
    dynamodb.update({
        TableName: 'Authors',
        Key: { 
            entity: data.entity,
            author: data.author
        },
        UpdateExpression: 'SET tweets = list_append(if_not_exists(tweets, :empty_list), :my_value)',
        ExpressionAttributeValues: { 
            ":my_value": [ data.tweet ],
            ":empty_list": []
        }
    }, (err) => {
        if (err) console.log(err)
    })

}
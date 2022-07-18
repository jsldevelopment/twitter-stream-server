import * as AWS from 'aws-sdk'
import { TwitterApi, Tweetv2FieldsParams } from 'twitter-api-v2'
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

const ruleset: ruleset = {
    1: {
        '3': 'tv shows',
        '4': 'tv episodes',
        '6': 'sports events',
        '10': 'person',
        '11': 'sport',
        '12': 'sports teams',
        '13': 'place',
        '22': 'tv genres',
        '23': 'tv channels',
        '26': 'sports league'
    },
    2: {
        '27': 'american football game',
        '28': 'nfl football game',
        '29': 'events',
        '31': 'community',
        '35': 'politicians',
        '38': 'political race',
        '39': 'basketball game',
        '40': 'sports series',
        '44': 'baseball game',
        '45': 'brand vertical'
    },
    '3': {
        '46': 'brand category',
        '47': 'brand',
        '48': 'product',
        '54': 'musician',
        '55': 'music genre',
        '56': 'actor',
        '58': 'entertainment personality',
        '60': 'athlete',
        '65': 'interests and hobbies vertical',
        '66': 'interests and hobbies catergory',
    },
    '4': {
        '67': 'interests and hobbies',
        '68': 'hockey game',
        '71': 'video game',
        '78': 'video game interest',
        '79': 'video game hardware',
        '83': 'cricket match',
        '84': 'book',
        '85': 'book genre',
        '86': 'movie',
        '87': 'movie genre'
    },
    '5': {
        '88': 'political body',
        '89': 'music album',
        '90': 'radio station',
        '91': 'podcast',
        '92': 'sports personality',
        '93': 'coach',
        '94': 'journalist',
        '95': 'tv channel [entity service]',
        '109': 'reoccuring trends',
        '110': 'viral accounts'
    },
    '6': {
        '114': 'concert',
        '115': 'video game conference',
        '116': 'video game tournament',
        '117': 'movie festival',
        '118': 'awards show',
        '119': 'holiday',
        '120': 'digital creator',
        '122': 'fictional character',
        '130': 'multimedia franchise',
        '136': 'video game personality',
    },
    '7': { 
        '137': 'esports team',
        '138': 'esports player',
        '139': 'fan community',
        '149': 'esports league',
        '152': 'food',
        '155': 'weather',
        '156': 'cities',
        '157': 'colleges & universities',
        '158': 'points of interest',
        '159': 'states'
    },
    '8': {
        '160': 'countries',
        '162': 'exercise & fitness',
        '163': 'travel',
        '164': 'fields of study',
        '165': 'technology',
        '166': 'stocks',
        '167': 'animals',
        '171': 'local news',
        '172': 'global tv show',
        '174': 'digital assets & crypto',
        '175': 'emergency events'
    }

}

// twitter api connections
const client = new TwitterApi(process.env.BEARER_TOKEN || "").v2.readOnly;

(async function start() {

    updateRules()
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
        deleteRules(ids)
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
            value: `context:${key}.*`
        })
    }
    client.updateStreamRules({ add: rulesToAdd })
        .then(() => {
            console.log('rules added')
        })
}

async function deleteRules(rules: string[]) {

    client.updateStreamRules({ delete: { ids: rules } })
        .then(() => {
            console.log('rules deleted')
        })

}

async function getStream() {
    const stream = await client.searchStream({
        "tweet.fields": ['author_id', 'id', 'context_annotations']
    })
    // how do we want to handle writing this data??????
    for await (let item of stream) {

        // TODO: this shit
        const contexts = item.data.context_annotations.reduce((prev, curr) => {
            return {
                entity: [ ...prev.entity, curr.entity.id ],
                ...prev
            }
        }, { author: item.data.author_id, id: item.data.id, entity: [] })

        console.log(contexts)

    }

    // current
    // author | entity[] | tweet

    // goal
    // author | entity | tweets[]
    // 123    | 5      | [1, 2, 3]
    // abc    | j      | [h, g, f]
}

async function writeToDb(entity) {

    dynamodb.batchWrite({
        RequestItems: {
            "Entity": [{
                PutRequest: {
                    Item: entity
                }
            }]
        }
    }, (err, data) => {
        if (err) console.log(err)
        else console.log(data)
    })

}
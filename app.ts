import * as AWS from 'aws-sdk'
import { TwitterApi, Tweetv2FieldsParams, TweetContextAnnotationV2 } from 'twitter-api-v2'
import 'dotenv/config'
import * as fs from 'fs'
import rules from './rules'
import { rule } from './rules.types'

// aws stuff below here ----------------
AWS.config.update({
    region: "us-east-1"
});

// dynamodb
const credentials = new AWS.SharedIniFileCredentials();
AWS.config.credentials = credentials;
export const dynamodb = new AWS.DynamoDB.DocumentClient();

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
    const nextRule = (Object.entries(rules).length === parsedData.currentRule) ? 1 : parsedData.currentRule+1
    const apiRules = await getRules()
    if (apiRules.length) {
        const ids = apiRules.map((rule) => {
            return rule.id
        })
        await deleteRules(ids)
    }
    await addRules(rules[nextRule])
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
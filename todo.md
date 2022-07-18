determine data -
    what do we need to know?
    entities? domains? users?
    
dynamodb -
    how to store this? tables etc

ui -
    best way to display this data and connect users across application and twitter

server -
    what routes are required to grab entity data?

used to create and compare users based on entitie count.
```js
{
    author: number, // sort key
    tweet_id: number, // partition key
    tweets: []

}
```

//
```js
{
    id: number, // sort key
    // profile user based on timeline
}
```

[dynamodb](https://www.tutorialspoint.com/dynamodb/dynamodb_overview.htm)
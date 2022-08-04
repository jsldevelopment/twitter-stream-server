```ts
Tweets: {
    author: string, // partition key
    entityCount: {
        [key: string]: number // how many times the users tweets include a given entity
    }
}
```

```ts
Users: {
    id: string, // partition key
    username: name, // display name
    entityCount: {
        [key: string]: number // how many times the users tweets include a given entity
    }
}
```
Creating the User Profile ->

When a user logs in to the app, the application will perform a DB Read to determine whether or not this is their first visit to the application.

First time users:
First time users will have their profile fetched from the api, and a new DB entry will be created on the Users table with their id and username.
After this, their timeline will be fetched. (Up to last 5k tweets.)
The timeline will then be parsed into entities, and an entityCount object will be created and added to their username DB record.
From here, the app will navigate the user to the home page.

Returning users:
Returning users will be sent to the home page (for now.)
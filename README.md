## Seeding- but authorizing a user

If you want to test something in your development environment, you seed the database to create data without manually adding data. I wondered if there was something similar but for authorizing a user without manually authorizing them.

I came up with this solution. I'm not sure if this is a proper but it works for me now.

## Steps to run this project

1. Download the repo
2. run `nodemon server.js` or `node server.js`
3. The terminal will give you errors for all the modules you don't have. Install the modules to fix the errors until the server file runs.
4. In your browser or Postman go to `http://localhost:4001/users/current` and you should see that there is no user associated with the session.
5. In a new terminal cd into the directory and run `node seed/addUserToSession.js`
6. Now when you go to `http://localhost:4001/users/current` you will see a user. This is the user set on req.user.
7. To delete the user from the session run `node seed/removeUserFromSession.js`

## Setting the Correct Session ID

`addUserToSession.js` and `removeUserFromSession.js` work by finding the first session in the database. If you have more than one session in the database, you will need to search the session by id to get the correct session. You will have more than one session in the database if you navigated to `http://localhost:4001` from more than one client.:

For example, navigating to anywhere on `http://localhost:4001` from

- Chrome
- Postman
- Safari

will create 3 seperate sessions.

So to only add a user to the Safari session, you'd have to find the session ID for the Safari session and add it in to the script. You can find the ID by adding a middleware:

```javascript
app.use((req,res,next)=>{
    console.log(req.sessionID);
    next()
})`
```

And navigating to `http://localhost:4001` from the client you want to session id for.

Alternatively clear all the sessions in the mongo shell.

```bash
$ mongo
> use setUser
> db.sessions.drop()
```

Now navigate to `http://localhost:4001` by the client you want to set the user on before running `node seed/addUserToSession.js`.

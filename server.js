const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const passport = require('passport');
const flash = require('connect-flash');
// const authenticateUser = require('./seed/authenticateUser');
const auth = require('./auth');

const app = express();

// without body parser passport won't be able to understand the json body in the user/login POST request
app.use(bodyParser.json());

app.use(
  session({
    secret: 'very secret 12345',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(auth.initialize);
app.use(auth.session);
app.use(flash());

app.use(async (req, res, next) => {
  console.log(`${req.method}: ${req.path}`);
  try {
    req.session.visits = req.session.visits ? req.session.visits + 1 : 1;
    return next();
  } catch (err) {
    return next(err);
  }
});
app.use((req, res, next) => {
  console.log(req.path);
  next();
});
app.get('/users/current', (req, res, next) => {
  let user;
  if (req.user) {
    user = { ...req.user };
    delete user.password;
  }
  res.send(user || 'not logged in');
});

// login a user POST body: { "username": "foo", "password": "bar"}
app.post(
  '/users/login',
  passport.authenticate('local', {
    successRedirect: '/users/login?error=false',
    failureRedirect: '/users/login?error=true',
    failureFlash: true,
  })
);

// redirects to this route after login attempt
app.get('/users/login', (req, res) => {
  console.log(`getting login page`);
  const flashmsg = req.flash('error');
  if (req.query.error === 'false') return res.send(`Welcome `);
  return res.send(`You were redirected because your login failed: ${flashmsg}`);
});

(async () =>
  mongoose.connect('mongodb://localhost/setUser', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  }))()
  .then(() => {
    console.log(`Connected to MongoDB set user test`);
    app.listen(4001).on('listening', () => {
      // authenticateUser();
      console.log('info', `HTTP server listening on port 4001`);
    });
  })
  .catch((err) => {
    console.error(err);
  });

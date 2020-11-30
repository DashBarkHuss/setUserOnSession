const passport = require('passport');
const LocalStrategy = require('passport-local');

// fake database for this example
const users = [{ username: 'foo', password: 'bar', _id: '123456' }];

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        // in a real application we would search a database ex: const user = await UserModel.findOne({ email: username }).exec();
        const user = users.find((u) => u.username === username);

        if (!user) {
          console.log('Invalid Username.');
          return done(null, false, { message: 'Invalid Username.' });
        }

        // in a real application we would compare the encrypted password in the database with the submitted password using something like bcrypt.compare() ex: const passwordOK = await user.comparePassword(password); where .comparePassword(password) is a method on the user model to compare the passwords
        const passwordOK = user.password === password;

        if (!passwordOK) {
          console.log(`Invalid Password`);
          return done(null, false, { message: 'Invalid Password.' });
        }
        return done(null, user);
      } catch (err) {
        console.log(`error logging in: ${err}`);
        return done(null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  try {
    // in a real application we would search a database ex: const user = await UserModel.findById(id).exec();
    const user = users.find((u) => u._id === id);
    return done(null, user);
  } catch (err) {
    console.log(err);
    return done(err);
  }
});

module.exports = {
  initialize: passport.initialize(),
  session: passport.session(),
};

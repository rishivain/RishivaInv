const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const port = 3003;

// Configure session middleware
app.use(session({
  secret: 'your-session-secret',  // Change this to a secure random string
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport and restore session
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use Google Strategy
passport.use(new GoogleStrategy({
  clientID: '7513471176-5iecabmakttkh2bqsnleg9droqbbu6ce.apps.googleusercontent.com', // Your Client ID
  clientSecret: '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',  // Your Client Secret
  callbackURL: '/auth/google/callback'
},
(accessToken, refreshToken, profile, done) => {
  // Here you could save user info to your database
  return done(null, profile);
}));

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

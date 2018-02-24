const express = require('express');
const passport = require('passport');
const router = express.Router();

const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL:'http://localhost:3000/callback'
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Please request a correct api');
});

router.get('/login', passport.authenticate('auth0', {
  clientID: 'WtzPKc52r5w0Xw-5CUuGzT8QvY3EGRFO',
  domain: 'murmur.eu.auth0.com',
  redirectUri: 'http://localhost:3000/callback',
  responseType: 'code',
  audience: 'https://' + 'murmur.eu.auth0.com' + '/userinfo',
  scope: 'openid profile'}),
  function(req, res) {
    res.redirect("/");
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get( '/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/failure'
  }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/user');
  }
);

router.get('/failure', function(req, res) {
  var error = req.flash("error");
  var error_description = req.flash("error_description");
  req.logout();
  res.send({
    error: error[0],
    error_description: error_description[0],
  });
});

module.exports = router;

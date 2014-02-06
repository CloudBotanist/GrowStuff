'use strict';

// User routes use users controller
var users = require('../controllers/users');

module.exports = function(app, passport) {

    app.get('/signout', users.signout);

    // Setting up the userId param
    app.param('userId', users.user);

    // Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter'), users.signin);
    app.get('/auth/twitter/callback', passport.authenticate('twitter'), users.authCallback);

};

'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/..');


// Extend the base configuration in all.js with environment
// specific configuration
module.exports = {
    root: rootPath,
    port: process.env.PORT || 3000,
    db: process.env.MONGOHQ_URL || 'mongodb://localhost/growstuff-test',

    sessionSecret: 'GrOwStuFf',
    sessionCollection: 'sessions',

    app: { name: 'GrowStuff' },

    twitter: {
        clientID: process.env.TWITTER_CONSUMER_KEY,
        clientSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:3000/auth/twitter/callback'
    }
};

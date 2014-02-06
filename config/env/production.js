'use strict';

module.exports = {
    db: 'mongodb://localhost/mean',
    app: {
        name: 'GrowStuff'
    },
    twitter: {
        clientID: 'CONSUMER_KEY',
        clientSecret: 'CONSUMER_SECRET',
        callbackURL: 'http://localhost:3000/auth/twitter/callback'
    }
};
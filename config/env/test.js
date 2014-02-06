'use strict';

module.exports = {
    db: 'mongodb://localhost/mean-test',
    port: 3001,
    app: {
        name: 'GrowStuff - Test'
    },
    twitter: {
        clientID: 'CONSUMER_KEY',
        clientSecret: 'CONSUMER_SECRET',
        callbackURL: 'http://localhost:3000/auth/twitter/callback'
    }
};
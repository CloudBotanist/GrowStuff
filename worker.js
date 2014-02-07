'use strict';

var Twit = require('twit');
var mongoose = require('mongoose');
var fs = require('fs');

var config = require('./config/config');

/**
 * Configuration
 */
mongoose.connect(config.db);

var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

var User = mongoose.model('User');

var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var stream = T.stream('statuses/filter', { track: '#gw' });

/**
 * Processing
 */

var respondToTweet = function(tweet, user, text) {
    var T = new Twit({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token: user.token,
        access_token_secret: user.token_secret
    });

    T.post('statuses/update', {
        status: '@' + tweet.user.screen_name + ' ' + text,
        in_reply_to_status_id: tweet.id
    }, function(err, res) {
        console.log(err, res);
    });
};

var processTweet = function(tweet, user) {
    if(/watering|status/.test(tweet.text)) {
        console.log("Matching tweet");
    } else {
        respondToTweet(tweet, user, 'Je ne connais pas mais je t\'aime déjà !');
    }
};

stream.on('tweet', function (tweet) {
    var userMentioned = tweet.entities.user_mentions.map(function(user){
        return user.screen_name;
    });

    if (userMentioned.length === 0) {
        return;
    }

    User.findOne({
        username: {$in: userMentioned}
    }, function(err, user) {
        if (err) {
            return console.log(err);
        }
        processTweet(tweet, user);
    });
});
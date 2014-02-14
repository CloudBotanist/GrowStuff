'use strict';

var Twit = require('twit');
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Mention = mongoose.model('Mention');


module.exports = function() {

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

    var respondToTweet = function(tweet, user, text, cb) {
        var T = new Twit({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token: user.token,
            access_token_secret: user.token_secret
        });

        console.log('Tweet Id ' + tweet.id );

        T.post('statuses/update', {
            status: '@' + tweet.user.screen_name + ' ' + text,
            in_reply_to_status_id: tweet.id_str
        }, function(err, res) {
            if(err) {
                console.log('[ERROR] ' + err);
                return cb(err);
            } else {
                return (null, res);
            }
        });
    };

    var processTweet = function(tweet, user) {

        var textToSend;
        if(/watering/.test(tweet.text)) {
            textToSend = 'Je vais m\'arroser !';
        } else if (/status/.test(tweet.text)) {
            textToSend = 'Status : Temperature 20° - Hymidité 30% - Chill out';
        } else {
            textToSend = 'Je n\'ai pas compris ! \n "Status" ou "Watering"';
        }

        respondToTweet(tweet, user, textToSend, function(err) {
            var mention = new Mention({
                text: tweet.text,
                status: err ? 'pending' : 'released',
                user: user._id,
                sender: tweet.user
            });
            mention.save();
        });

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
            if (err || !user) {
                return;
            }

            console.log('Concerned user by tweet ' + tweet.id + ' -> ' + JSON.stringify(user));
            processTweet(tweet, user);
        });
    });
};
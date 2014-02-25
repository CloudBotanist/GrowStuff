'use strict';

var Twit = require('twit');
var socket = require('./socket');
var async = require('async');
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Plant = mongoose.model('Plant'),
    Status = mongoose.model('Status'),
    Mention = mongoose.model('Mention');


/**
 *  Respond to tweet
 *  Based on the context
 */
var respondToTweet = function(tweet, user, text, cb) {
    var T = new Twit({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token: user.token,
        access_token_secret: user.token_secret
    });

    T.post('statuses/update', {
        status: text,
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

/**
 *  Return the genereted text based on the context
 */
var generateText = function(userMentioned, tweet, plant, cb) {
    var textToSend;

    // Process watering
    if(/watering/.test(tweet.text)) {
        var quantity = tweet.text.match(/([0-9]+)(ml|mL)/g);
        if (!quantity || quantity.length !== 1) {
            return cb(null, 'No quantity or several quantity has been provided');
        }

        quantity = quantity[0].slice(0, -2);
        socket.sendMessage(plant._id, 'watering', quantity);
        textToSend = 'Watering #' + plant.name + ' with ' + quantity + 'mL';
        return cb(null, textToSend);
    } else if (/status/.test(tweet.text)) {
        Status.find({
            plant: plant._id
        }).sort({created: -1})
        .limit(1)
        .exec(function(err, mentions) {
            if (err) {
                return cb(err);
            }

            if (mentions.length === 0) {
                return cb(null, 'No status sended by #' + plant.name);
            }

            var lastStatus = mentions[0];
            textToSend = 'Plant #' + plant.name + ' : Temperature ' + lastStatus.tmp + ' - Hymidity ' + lastStatus.hum + '%';
            return cb(null, textToSend);
        });
    } else {
        cb(null, 'Not undestanded command for #' + plant.name);
    }
};

/**
 * Process the tweet
 */
var processTweet = function(userMentioned, tweet, cb) {
    var targetedUser;
    var targetedPlant;

    async.waterfall([
        function(cb) {
            // Find the user
            User.findOne({
                username: {$in: userMentioned}
            }, cb);
        },
        function(user, cb) {
            if (!user) {
                return cb('no_user');
            }

            targetedUser = user;

            // Find the plants
            Plant.find({user: user._id}, function(err, plants) {
                if (err) {
                    return cb(err);
                }

                var connectedPlants = [];
                plants.forEach(function(plant) {
                    if(socket.isPlantConnected(plant._id)) {
                        connectedPlants.push(plant);
                    }
                });

                cb(null, connectedPlants);
            });
        },
        function(plants, cb) {
            // Selec the right plant
            if (plants.length === 0) {
                return cb('no_plant');
            } else if(plants.length === 1) {
                return cb(null, plants[0]);
            } else {
                var hashtags = tweet.text.match(/#([a-zA-Z0-9]+)/g);
                hashtags.forEach(function(hashtag) {
                    plants.forEach(function(plant) {
                        if ('#' + plant.name === hashtag) {
                            return cb(null, plant);
                        }
                    });
                });

                return cb('no_plant');
            }
        },
        function(plant, cb) {
            targetedPlant = plant;
            generateText(userMentioned, tweet, plant, cb);
        }
    ],function(err, res) {
        // Create the text mentions
        var text;
        if (err === 'no_plant') {
            text = 'No plant has been selected of the plant is disconnected';
        } else if(err === 'no_user') {
            text = 'I don\'t know you but I love you !';
        } else if (err) {
            text = 'Server error';
        } else {
            text = res;
        }

        // Formating date
        var d = new Date();
        var formatedDate = d.getHours() + ':' + d.getMinutes();

        var respondText = '@' + tweet.user.screen_name + ' (' + formatedDate + ') ' + text;

        if (targetedUser) {
            var incommingMention = new Mention({
                text: tweet.text,
                plant: targetedPlant,
                user: targetedUser,
                sender: tweet.user
            });
            incommingMention.save();

            var outMention = new Mention({
                text: respondText,
                plant: targetedPlant,
                user: targetedUser,
                sender: targetedUser
            });
            outMention.save();
        }

        cb(null, respondText, targetedUser);
    });
};

module.exports.crawler = function() {

    var T = new Twit({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    var stream = T.stream('statuses/filter', { track: '#gw' });

    console.log('Crawler twitter booted');

    stream.on('tweet', function (tweet) {
        var userMentioned = tweet.entities.user_mentions.map(function(user){
            return user.screen_name;
        });

        if (userMentioned.length === 0) {
            return;
        }

        processTweet(userMentioned, tweet, function(err, text, targetedUser) {
            if(err) {
                console.log(err);
                return;
            }

            respondToTweet(tweet, text, targetedUser);
        });
    });
};

module.exports.test = function(text, userMentioned) {
    console.log(text);
    console.log(userMentioned);
    console.log('---> BEFORE');

    var tweet = {
        text: text,
        user: {
            screen_name: 'Matt'
        }
    };

    processTweet(userMentioned, tweet, function(err, textToSend, targetedUser) {

        console.log('---> AFTER');
        console.log(textToSend);
    });
};
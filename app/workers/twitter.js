'use strict';

var Twit = require('twit');
var socket = require('./socket');
var async = require('async');
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Plant = mongoose.model('Plant'),
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

        async.waterfall([
            function(cb) {
                // Retrieve users plants
                Plant.find({user: user._id}, cb);
            }, function(plants, cb) {
                // Delete plant which are not connected
                var connectedPlants = [];
                plants.forEach(function(plant) {
                    if(socket.isPlantConnected(plant._id)) {
                        connectedPlants.push(plant);
                    }
                });

                // Select the plant
                if (connectedPlants.length === 0) {
                    cb(null, null, connectedPlants);
                } else if(connectedPlants.length === 1) {
                    cb(null, connectedPlants[0], connectedPlants);
                } else {
                    var hashtags = tweet.text.match(/#([a-zA-Z0-9]+)/g);
                    hashtags.forEach(function(hashtag) {
                        plants.forEach(function(plant) {
                            if ('#' + plant.name === hashtag) {
                                return cb(null, plant, connectedPlants);
                            }
                        });
                    });

                    return cb(null, null, connectedPlants);
                }
            }, function(plant, connectedPlants, cb) {
                // Create string with available plants
                var availablePlants = '';
                connectedPlants.forEach(function(plant) {
                    availablePlants += '#' + plant.name + ' ';
                });

                console.log(availablePlants);

                // Set the mention text
                if (!plant) {
                    return cb(null, 'Pas de plante mentionée \n' + availablePlants);
                } else if(/watering/.test(tweet.text)) {
                    socket.sendMessage(plant._id, 'watering', 5);
                    textToSend = plant.name + ' : Arroser la plante';
                } else if (/status/.test(tweet.text)) {
                    textToSend = plant.name + ' : Temperature 20° - Hymidité 30% - Chill out';
                } else {
                    textToSend = 'Pas compris\nCommandes: "status" ou "watering"\n' + 'Plantes: ' + availablePlants;
                }

                cb(null, plant);
            }
        ], function(err, res) {
            if (err || !textToSend) {
                textToSend = 'Erreur serveur';
            }

            respondToTweet(tweet, user, textToSend, function(err) {
                var mention = new Mention({
                    text: tweet.text,
                    plant: res.plant ? res.plant._id : null,
                    status: err ? 'pending' : 'released',
                    user: user._id,
                    sender: tweet.user
                });
                mention.save();
            });
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
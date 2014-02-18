'use strict';

var mongoose = require('mongoose'),
    Plant = mongoose.model('Plant'),
    Mention = mongoose.model('Mention'),
    Status = mongoose.model('Status');

var sockets = require('../../workers/socket');
var async = require('async');

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.send(401, 'User is not authorized');
    }

    Plant.find({user: req.user._id}, function(err, plants) {
        if (err) {
            return res.render('error', {
                status: 500
            });
        }

        async.map(plants, function(plant, cb) {
            async.parallel([
                function(cb) {
                    cb(null, sockets.isPlantConnected(plant._id));
                },
                function(cb) {
                    Mention.find({}).sort({date: -1}).exec(cb);
                },
                function(cb) {
                    Status.find({plant: plant.id}).sort({created: -1}).limit(100).exec(cb);
                }
            ],
                function(err, results){
                    if (err) {
                        return cb(err);
                    }

                    var newPlant = plant;

                    newPlant.is_connected = results[0];
                    newPlant.mentions = results[1];
                    newPlant.status = results[2];

                    cb(null, newPlant);
                }
            );
        }, function(err, plants) {
            if (err) {
                return next(err);
            }

            req.user.plants = plants;
            next();
        });
    });
};
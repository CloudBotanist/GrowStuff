'use strict';

var mongoose = require('mongoose'),
    Plant = mongoose.model('Plant');

var sockets = require('../../workers/socket');

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

        plants.forEach(function(plant) {
            plant.is_connected = sockets.isPlantConnected(plant._id);
        });

        req.user.plants = plants;
        next();
    });
};
'use strict';

var mongoose = require('mongoose'),
    Plant = mongoose.model('Plant');

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

        req.user.plants = plants;
        next();
    });
};
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Plant = mongoose.model('Plant'),
    _ = require('lodash');


/**
 * Find plant by id
 */
exports.plant = function(req, res, next, id) {
    Plant.load(id, function(err, plant) {
        if (err) return next(err);
        if (!plant) return next(new Error('Failed to load plant ' + id));
        req.plant = plant;
        next();
    });
};

/**
 * Create a plant
 */
exports.create = function(req, res) {
    var plant = new Plant(req.body);
    plant.user = req.user;

    plant.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                plant: plant
            });
        } else {
            res.jsonp(plant);
        }
    });
};

/**
 * Update a plant
 */
exports.update = function(req, res) {
    var plant = req.plant;

    plant = _.extend(plant, req.body);

    plant.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                plant: plant
            });
        } else {
            res.jsonp(plant);
        }
    });
};

/**
 * Delete an plant
 */
exports.destroy = function(req, res) {
    var plant = req.plant;

    plant.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                plant: plant
            });
        } else {
            res.jsonp(plant);
        }
    });
};

/**
 * Show an plant
 */
exports.show = function(req, res) {
    res.jsonp(req.plant);
};

/**
 * List of Plants
 */
exports.all = function(req, res) {
    Plant.find().sort('-created').populate('user', 'name username').exec(function(err, plants) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(plants);
        }
    });
};
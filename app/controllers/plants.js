'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Plant = mongoose.model('Plant'),
    Mention = mongoose.model('Mention'),
    Status = mongoose.model('Status'),
    sockets = require('../workers/socket'),
    _ = require('lodash');

var async = require('async');



/**
 * Find plant by id
 */
exports.plant = function(req, res, next, id) {
    Plant.load(id, function(err, plant) {

        async.parallel([
            function(cb) {
                cb(null, sockets.isPlantConnected(plant._id));
            },
            function(cb) {
                Mention.find({plant: plant.id}).sort({date: -1}).exec(cb);
            },
            function(cb) {
                Status.find({plant: plant.id}).sort({created: -1}).limit(100).exec(cb);
            }
        ],
            function(err, results){
                if (err) {
                    res.render('error', {
                        status: 500
                    });
                }

                var newPlant = plant;

                newPlant.is_connected = results[0];
                newPlant.mentions = results[1];
                newPlant.status = results[2];

                req.plant = newPlant;
                next();
            }
        );

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
            return res.render('new_plant', {
                user: req.user,
                errors: err.errors,
                plant: plant
            });
        } else {
            return res.redirect('/plants/' + plant._id);
        }
    });
};

/**
 * Create a plant
 */
exports.new = function(req, res) {
    res.render('plants/new', {
        user: req.user
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
            return res.render('dashboard', {
                user: req.user,
                errors: err.errors,
                plant: plant
            });
        } else {
            return res.redirect('/');
        }
    });
};

/**
 * Show an plant
 */
exports.show = function(req, res) {
    if (req.plant.status.length === 0) {
        // Render the configuration page
        res.render('plants/config', {
            user: req.user,
            plant: req.plant
        });
    } else {
        // Render the normal page
        res.render('plants/show', {
            user: req.user,
            plant: req.plant
        });
    }
};

/**
 * Download configuration file
 */
exports.configFile = function(req, res) {
    res.attachment('growstuff-' + req.plant.name + '.config');

    var configuration = '# Plant identification \n';
    configuration += 'ID=' + req.plant.id + '\n';
    configuration += '# Plant name \n';
    configuration += 'NAME=' + req.plant.name + '\n';
    configuration += '# Plant type \n';
    configuration += 'TYPE=' + req.plant.type + '\n';

    res.send(configuration);
};

/**
 * Download configuration file
 */
exports.watering = function(req, res) {
    if (req.plant.is_connected) {
        sockets.sendMessage(req.plant._id, 'watering', {time: 5});
    }

    res.redirect('/plants/' + req.plant._id);
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
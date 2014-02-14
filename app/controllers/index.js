'use strict';

var mongoose = require('mongoose'),
    Plant = mongoose.model('Plant');

exports.index = function(req, res) {
    res.render('index', {
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
};


exports.dashboard = function(req, res) {
    Plant.find({user: req.user._id}, function(err, plants) {
        if (err) {
            res.render('error', {
                status: 500
            });
        }

        res.render('dashboard', {
            user: req.user,
            plants: plants
        });
    });
};
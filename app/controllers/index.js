'use strict';

exports.index = function(req, res) {
    if (req.user) {
        return res.redirect('/dashboard');
    }

    res.render('index', {
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
};


exports.dashboard = function(req, res) {
    if (req.user.plants.length === 0) {
        return res.redirect('/plants/new');
    }

    res.redirect('/plants/' + req.user.plants[0]._id);
};
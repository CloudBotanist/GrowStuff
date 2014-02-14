'use strict';

exports.index = function(req, res) {
    res.render('index', {
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
};


exports.dashboard = function(req, res) {
    console.log(req.user);
    res.render('dashboard', {
        user: req.user
    });
};
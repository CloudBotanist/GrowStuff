'use strict';

exports.index = function(req, res) {
    res.render('index', {
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
};


exports.dashboard = function(req, res) {
    res.render('dashboard');
};
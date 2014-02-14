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
    res.render('dashboard', {
        user: req.user
    });
};
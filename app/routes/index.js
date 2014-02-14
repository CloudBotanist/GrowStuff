'use strict';

var authorization = require('./middlewares/authorization');
var website = require('../controllers/index');

module.exports = function(app) {

    app.get('/', website.index);
    app.get('/dashboard', authorization.requiresLogin ,website.dashboard);

};

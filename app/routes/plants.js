'use strict';

// Plants routes use plants controller
var plants = require('../controllers/plants');
var authorization = require('./middlewares/authorization');

// Plant authorization helpers
var hasAuthorization = function(req, res, next) {
	if (req.plant.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(app) {

//    app.get('/plants', authorization.requiresLogin, plants.all);
    app.get('/plants/new', authorization.requiresLogin, plants.new);
    app.post('/plants', authorization.requiresLogin, plants.create);
    app.get('/plants/:plantsId', authorization.requiresLogin, hasAuthorization, plants.show);
    app.get('/plants/:plantsId/config', authorization.requiresLogin, hasAuthorization, plants.configFile);
    app.put('/plants/:plantsId', authorization.requiresLogin, hasAuthorization, plants.update);
    app.get('/plants/:plantsId/delete', authorization.requiresLogin, hasAuthorization, plants.destroy);
    app.get('/plants/:plantsId/watering', authorization.requiresLogin, hasAuthorization, plants.watering);

    // Finish with setting up the articleId param
    app.param('plantsId', plants.plant);

};
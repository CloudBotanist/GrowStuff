'use strict';

// Plants routes use plants controller
var plants = require('../controllers/plants');
var authorization = require('./middlewares/authorization');

// Plant authorization helpers
var hasAuthorization = function(req, res, next) {
	if (req.article.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(app) {

    app.get('/plants', authorization.requiresLogin, plants.all);
    app.post('/plants', authorization.requiresLogin, plants.create);
    app.get('/plants/:plantsId', authorization.requiresLogin, hasAuthorization, plants.show);
    app.put('/plants/:plantsId', authorization.requiresLogin, hasAuthorization, plants.update);
    app.del('/plants/:plantsId', authorization.requiresLogin, hasAuthorization, plants.destroy);

    // Finish with setting up the articleId param
    app.param('plantsId', plants.plant);

};
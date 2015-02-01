'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	var predictions = require('../../app/controllers/predictions.server.controller');
	app.route('/').get(core.index);

	// Predictions routing
	app.route('/predictions/specific').post(predictions.specificPredictions);
	app.route('/predictions/current').get(predictions.currentStatic);
};
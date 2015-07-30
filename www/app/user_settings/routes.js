'use strict';

var controllers = require('./controllers');

function userSettingsRoutes($stateProvider) {

	$stateProvider
	.state('root.user_settings', {
		url: "/settings",
		views: {
			'content': {
				template: require('./templates/user_settings.html'),
				controller: controllers.userSettingsController
			}
		}
	});
}

module.exports = {
	userSettingsRoutes: userSettingsRoutes
};
'use strict';

var controllers = require('./controllers');

function userSettingsRoutes($stateProvider) {

	var translations = [
		'user_settings.lang_changed',
		'user_settings.change_lang',
		'user_settings.confirm_change_lang_interface',
		'user_settings.confirm_change_lang_data',
		'user_settings.delete_data',
		'user_settings.confirm_delete_data',
		'user_settings.deleting',
		'user_settings.deleting_data',
		'user_settings.data_deleted'
	];

	$stateProvider
	.state('root.user_settings', {
		url: "/settings",
		views: {
			'content': {
				template: require('./templates/user_settings.html'),
				controller: controllers.userSettingsController
			}
		},
		resolve : {
			translations: function ($translate) {
				return ($translate(translations));
			}
		}
	});
}

module.exports = {
	userSettingsRoutes: userSettingsRoutes
};
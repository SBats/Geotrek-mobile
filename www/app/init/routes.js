'use strict';

var controller = require('./controllers');

function initRoutes($stateProvider) {

	var translations = [
		'init.loading_translations',
		'init.loading_treks',
		'init.loading_tiles',
		'init.updating_treks',
		'init.done'
	];

	$stateProvider
		.state('root.init', {
			url: '/init',
			views : {
				'content' : {
					template: require('./templates/init.html'),
					controller: controller.initController
				}
			},
			resolve : {
				translations : function ($translate) {
					return ($translate(translations));
				}
			}
		});
}

module.exports = {
	initRoutes: initRoutes
};
'use strict';

var controllers = require('./controllers');

function listDisplayRoutes($stateProvider) {
	
	$stateProvider
	.state('root.treks_list', {
		url: "/treks",
		views: {
			'content': {
				template: require('./templates/treks_list.html'),
				controller: controllers.listDisplayController
			}
		}
	});
}

module.exports = {
	listDisplayRoutes: listDisplayRoutes
}
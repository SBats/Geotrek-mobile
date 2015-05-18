'use strict';

var controllers = require('./controllers');

function mapRoutes($stateProvider) {
	
	$stateProvider
	.state('root.map', {
		url: "/map",
		views: {
			'content': {
				template: require('./templates/map.html'),
				controller: controllers.mapController
			}
		}
	});
}

module.exports = {
	mapRoutes: mapRoutes
};
'use strict';

var controllers = require('./controllers');

function mapRoutes($stateProvider) {
	
	$stateProvider
	.state('root.map', {
		url:'/map',
		views: {
			'content': {
				template: require('./templates/map.html'),
				controller: controllers.mapController
			}
		}
	})

	.state('root.map.global', {
		url: "/global",
		views: {
			'map_view': {
				template: require('./templates/global_map.html'),
				controller: controllers.globalMapController
			}
		}
	})

	.state('root.map.detailed', {
		url: "/trek-:trekId",
		views: {
			'map_view': {
				template: require('./templates/detailed_map.html'),
				controller: controllers.detailedMapController
			}
		}
	});
}

module.exports = {
	mapRoutes: mapRoutes
};
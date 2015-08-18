'use strict';

var controllers = require('./controllers');

function mapRoutes($stateProvider) {
	
	$stateProvider
	.state('root.map', {
		asbtract: true,
		views: {
			'content': {
				template: require('./templates/map.html'),
				controller: controllers.mapController
			}
		}
	})

	.state('root.map.global', {
		url: "/map",
		views: {
			'map_view': {
				controller: controllers.globalMapController
			}
		}
	})

	.state('root.map.detailed', {
		url: "/map/:trekId",
		resolve : {
			trek: function(TreksFactory, $stateParams) {
				return (TreksFactory.getTrek($stateParams.trekId));
			}
		},
		views: {
			'map_view': {
				controller: controllers.detailedMapController
			}
		}
	});
}

module.exports = {
	mapRoutes: mapRoutes
};
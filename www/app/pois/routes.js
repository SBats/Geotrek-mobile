'use strict';

var controllers = require('./controllers');

function poiRoutes($stateProvider) {

	$stateProvider
	.state('root.poi', {
		url: "/poi-:poiId?trekId",
		resolve: {
			poi: function(PoisService, $stateParams) {
				return (PoisService.getPoi($stateParams.poiId));
			}
		},
		views: {
			'content': {
				template: require('./templates/poi.html'),
				controller: controllers.poiController
			}
		}
	});
}

module.exports = {
	poiRoutes: poiRoutes
};
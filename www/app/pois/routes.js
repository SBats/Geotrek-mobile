'use strict';

var controllers = require('./controllers');

function poiRoutes($stateProvider) {

	$stateProvider
	.state('root.poi', {
		url: "/poi-:poiId?trekId&view",
		resolve: {
			poi: function(PoisService, $stateParams) {
				return (PoisService.getPoi($stateParams.poiId, $stateParams.trekId));
			},
			trek: function(TreksFactory, $stateParams) {
				return (TreksFactory.getTrek($stateParams.trekId));
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
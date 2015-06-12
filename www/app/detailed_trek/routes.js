'use strict';

var controllers = require('./controllers');

function detailedTrekRoutes($stateProvider) {

	$stateProvider
	.state('root.detailed_trek', {
		url: "/trek-:trekId",
		resolve: {
			trek: function(TreksService, $stateParams) {
				return (TreksService.getTrek($stateParams.trekId));
			},
			pois: function(PoisService, trek) {
				return (PoisService.getTrekPois(trek.id));
			}
		},
		views: {
			'content': {
				template: require('./templates/detailed_trek.html'),
				controller: controllers.detailedTrekController
			}
		}
	});
}

module.exports = {
	detailedTrekRoutes: detailedTrekRoutes
};
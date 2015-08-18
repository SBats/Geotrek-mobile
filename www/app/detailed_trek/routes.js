'use strict';

var controllers = require('./controllers');

function detailedTrekRoutes($stateProvider) {

	$stateProvider
	.state('root.detailed_trek', {
		url: "/trek-:trekId",
		resolve: {
			treks: function(TreksFactory) {
				return (TreksFactory.getTreks());
			},
			pois: function(PoisService, $stateParams) {
				return (PoisService.getTrekPois($stateParams.trekId));
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
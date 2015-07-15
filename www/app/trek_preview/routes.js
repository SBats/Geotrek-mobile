'use strict';

var controllers = require('./controllers');

function trekPreviewRoutes($stateProvider) {

	$stateProvider
	.state('root.trek_preview', {
		url: "/preview-:trekId",
		resolve: {
			trek: function(TreksService, $stateParams) {
				return (TreksService.getTrek($stateParams.trekId));
			}
		},
		views: {
			'content': {
				template: require('./templates/trek_preview.html'),
				controller: controllers.trekPreviewController
			}
		}
	});
}

module.exports = {
	trekPreviewRoutes: trekPreviewRoutes
};
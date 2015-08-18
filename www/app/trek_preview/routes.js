'use strict';

var controllers = require('./controllers');

function trekPreviewRoutes($stateProvider) {

	$stateProvider
	.state('root.trek_preview', {
		url: "/preview-:trekId",
		resolve: {
			trek: function(TreksFactory, $stateParams) {
				return (TreksFactory.getTrek($stateParams.trekId));
			}
		},
		views: {
			'content': {
				template: require('./templates/trek_preview.html'),
				controller: controllers.trekPreviewController
			}
		}
	})

	.state('root.check_trek', {
		url: "/check-trek-:trekId",
		resolve: {
			isTrekDownloaded: function(TreksFactory, $stateParams) {
				return (TreksFactory.isTrekDownloaded($stateParams.trekId));
			}
		},
		views: {
			'content': {
				controller: controllers.checkTrekController
			}
		}
	});
}

module.exports = {
	trekPreviewRoutes: trekPreviewRoutes
};
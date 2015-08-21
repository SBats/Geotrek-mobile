'use strict';

var controllers = require('./controllers');

function trekPreviewRoutes($stateProvider) {

	var translations = [
		'trek_preview.download',
		'trek_preview.downloading',
		'trek_preview.confirm_download',
		'trek_preview.downloaded'
	];

	$stateProvider
	.state('root.trek_preview', {
		url: "/preview-:trekId",
		views: {
			'content': {
				template: require('./templates/trek_preview.html'),
				controller: controllers.trekPreviewController
			}
		},
		resolve: {
			trek: function(TreksFactory, $stateParams) {
				return (TreksFactory.getTrek($stateParams.trekId));
			},
			translations: function($translate) {
				return ($translate(translations));
			}
		}
	});
}

module.exports = {
	trekPreviewRoutes: trekPreviewRoutes
};
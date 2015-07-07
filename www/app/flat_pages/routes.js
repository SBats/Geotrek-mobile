'use strict';

var controllers = require('./controllers');

function flatPagesRoutes($stateProvider) {

	$stateProvider
	.state('root.flat_pages', {
		url: "/flat_pages",
		resolve : {
			flatPages: function (FlatPagesServices) {
				return (FlatPagesServices.getFlatPages());
			}
		},
		views: {
			'content': {
				template: require('./templates/flat_pages.html'),
				controller: controllers.flatPagesController
			}
		}
	})
	.state('root.flat_page', {
		url: "/flat_page_:flatId",
		resolve : {
			flatPage: function ($stateParams, FlatPagesServices) {
				return (FlatPagesServices.getFlatPage($stateParams.flatId));
			}
		},
		views: {
			'content': {
				template: require('./templates/flat_page.html'),
				controller: controllers.flatPageController
			}
		}
	});
}

module.exports = {
	flatPagesRoutes: flatPagesRoutes
};
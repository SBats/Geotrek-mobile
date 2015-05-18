'use strict';

var controllers = require('./controllers');

function favoritesRoutes($stateProvider) {
	
	$stateProvider
	.state('root.favorites', {
		url: "/favorites",
		views: {
			'content': {
				template: require('./templates/favorites.html'),
				controller: controllers.favoritesController
			}
		}
	});
}

module.exports = {
	favoritesRoutes: favoritesRoutes
};
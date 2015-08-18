'use strict';

var controllers = require('./controllers');

function listDisplayRoutes($stateProvider) {
	
	$stateProvider
	.state('root.treks_list', {
		url: "/treks",
		views: {
			'content': {
				template: require('./templates/treks_list.html'),
				controller: controllers.listDisplayController
			}
		},
		resolve: {
			treks: function (FiltersFactory) {
				return (FiltersFactory.getFilteredTreks());
			}
		}
	})

	.state('root.favorites', {
		url: "/favorites",
		views: {
			'content': {
				template: require('./templates/favorites.html'),
				controller: controllers.listDisplayController
			}
		},
		resolve: {
			treks: function (TreksFactory) {
				return (TreksFactory.getDownloadedTreks());
			}
		}
	});
}

module.exports = {
	listDisplayRoutes: listDisplayRoutes
};
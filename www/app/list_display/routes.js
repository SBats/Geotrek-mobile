'use strict';

var controllers = require('./controllers');

function listDisplayRoutes($stateProvider) {
	
	var translations = [
		'treks_list.delete',
		'treks_list.confirm_delete',
		'treks_list.deleting',
		'treks_list.trek_deleted'
	];

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
			},
			translations: function ($translate) {
				return ($translate(translations));
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
				return (TreksFactory.getDownloadedParentTreks());
			},
			translations: function ($translate) {
				return ($translate(translations));
			}
		}
	});
}

module.exports = {
	listDisplayRoutes: listDisplayRoutes
};
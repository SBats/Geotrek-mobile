'use strict';

function favoritesController($rootScope, $scope, $state, FavoritesService) {

	var refreshFavorites = function () {
		FavoritesService.getFavorites().then(function (treks) {
			$scope.treks = treks;
		});
	};

	refreshFavorites();

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		if (toState.name === 'root.favorites')
			refreshFavorites();
	});

}

module.exports = {
	favoritesController: favoritesController
};
'use strict';

function detailedTrekController($scope, $stateParams, trek, FavoritesService) {

	$scope.trek = trek;

	$scope.addToFavorites = function () {
		FavoritesService.changeFavorites($stateParams.trekId);
		$scope.isFavorite = FavoritesService.isFavorite($stateParams.trekId);
	};

	$scope.isFavorite = FavoritesService.isFavorite($stateParams.trekId);
}

module.exports = {
	detailedTrekController: detailedTrekController
};
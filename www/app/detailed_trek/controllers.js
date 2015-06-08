'use strict';

function detailedTrekController($ionicHistory, $state, $scope, $stateParams, $sce, trek, FavoritesService) {

	console.log(trek);

	$scope.trek = trek;
	$scope.mainDescription = $sce.trustAsHtml(trek.properties.description);

	$scope.switchToMap = function () {
		$ionicHistory.nextViewOptions({	disableBack: true });
		$state.go('root.map.detailed', { trekId: trek.id });
	};

	$scope.addToFavorites = function () {
		FavoritesService.changeFavorites(trek.id);
		$scope.isFavorite = FavoritesService.isFavorite(trek.id);
	};

	$scope.isFavorite = FavoritesService.isFavorite($stateParams.trekId);
}

module.exports = {
	detailedTrekController: detailedTrekController
};
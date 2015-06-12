'use strict';

function detailedTrekController($ionicHistory, $state, $scope, $ionicSlideBoxDelegate, trek, pois, FavoritesService) {

	console.log(trek);

	var tabs = $ionicSlideBoxDelegate.$getByHandle('detailed_trek_tabs');

	$scope.trek = trek;
	$scope.pois = pois;
	$scope.selected = 'infos';

	$scope.switchToMap = function () {
		$ionicHistory.nextViewOptions({	disableBack: true });
		$state.go('root.map.detailed', { trekId: trek.id });
	};

	$scope.addToFavorites = function () {
		FavoritesService.changeFavorites(trek.id);
		$scope.isFavorite = FavoritesService.isFavorite(trek.id);
	};

	$scope.changeTab = function (slideNb, id) {
		tabs.slide(slideNb);
		$scope.selected = id;
	};

	$scope.isFavorite = FavoritesService.isFavorite(trek.id);
}

module.exports = {
	detailedTrekController: detailedTrekController
};
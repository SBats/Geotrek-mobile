'use strict';

function detailedTrekController($ionicHistory, $state, $scope, $ionicSlideBoxDelegate, trek, pois, utils, constants, settings, TreksService, FavoritesService) {

	console.log(trek);

	var tabs = $ionicSlideBoxDelegate.$getByHandle('detailed_trek_tabs');

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

	$scope.downloadTrek = function () {
		TreksService.deleteOrDownload(trek.id).then(function (res) {
			console.log(res);
			$scope.isDownloaded = (res === constants.TREK_DOWNLOADED);
			if (!FavoritesService.isFavorite(trek.id)) {
				FavoritesService.changeFavorites(trek.id);
				$scope.isFavorite = FavoritesService.isFavorite(trek.id);
			}
		});
	};

	TreksService.isTrekDownloaded(trek.id).then(function (res) { $scope.$parent.isDownloaded = res; });
	$scope.trek = trek;
	$scope.isFavorite = FavoritesService.isFavorite(trek.id);
	$scope.pois = pois;
	$scope.selected = 'infos';
}

module.exports = {
	detailedTrekController: detailedTrekController
};
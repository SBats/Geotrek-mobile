'use strict';

function trekPreviewController($scope, trek, constants, settings, utils, FavoritesService, TreksService) {

	$scope.addToFavorites = function () {
		FavoritesService.changeFavorites(trek.id);
		$scope.isFavorite = FavoritesService.isFavorite(trek.id);
	};

	$scope.downloadTrek = function () {

		var loadingBar = document.getElementById('loading_bar');

		$scope.downloadButton = 'hide';
		$scope.loadingBar = '';
		$scope.currentDownload = 'Trek infos';

		utils.downloadAndUnzip(settings.trekZipUrl + trek.id + '.zip', settings.treksDir + '/' + trek.id, trek.id + '.zip')
		.then(function (downloadRes) {

			$scope.currentDownload = 'Map tiles';
			utils.downloadAndUnzip(settings.tilesZipUrl + trek.id + '.zip', settings.tilesDir + '/' + trek.id, trek.id + '.zip')
			.then(function (success) {

				$scope.currentDownload = 'Finished';
				FavoritesService.addToFavorites(trek.id);
			}, function (error) {
				console.log(error);
			}, function (progress) {
				loadingBar.style.width = String((progress.loaded / progress.total) * 50 + 50) + '%';
			});

		}, function (error) {
			console.log(error);
		}, function (progress) {
			loadingBar.style.width = String((progress.loaded / progress.total) * 50) + '%';
		});
	};

	$scope.downloadButton = '';
	$scope.loadingBar = 'hide';

	$scope.isFavorite = FavoritesService.isFavorite(trek.id);
	$scope.trek = trek;
}

module.exports = {
	trekPreviewController: trekPreviewController
};
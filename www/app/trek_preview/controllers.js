'use strict';

function trekPreviewController($ionicHistory, $state, $scope, $ionicPopup, trek, constants, settings, utils, TreksService) {

	$scope.downloadTrek = function () {

		var loadingBar = document.getElementById('loading_bar');

		$ionicPopup.confirm({
			title: 'Téléchargement',
			template: 'Etes vous sur de vouloir télécharger cette rando ?'
		}).then(function (res) {
			if (res) {

				$scope.downloadButton = 'hide';
				$scope.loadingBar = '';

				TreksService.downloadTrek(trek.id).then(function (success) {

					$ionicPopup.alert({
						template: 'Téléchargement terminé'
					}).then(function (res) {
						$ionicHistory.nextViewOptions({	disableBack: true });
						$state.go('root.detailed_trek', { trekId: trek.id });
					});

				}, function (error) {
					console.log(error);
				}, function (progress) {
					loadingBar.style.width = progress;
				});
			}
		});
	};

	$scope.downloadButton = '';
	$scope.loadingBar = 'hide';

	$scope.trek = trek;
}

function checkTrekController($state, $stateParams, isTrekDownloaded) {

	$state.go(isTrekDownloaded ? 'root.detailed_trek' : 'root.trek_preview', { trekId : $stateParams.trekId });
}

module.exports = {
	trekPreviewController: trekPreviewController,
	checkTrekController: checkTrekController
};
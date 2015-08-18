'use strict';

function trekPreviewController($ionicHistory, $state, $scope, $ionicPopup, trek, constants, settings, utils, TreksFactory) {

	$scope.downloadTrek = function () {

		var loadingBar = document.getElementById('loading_bar');
		var nbDownloads;

		$ionicPopup.confirm({
			title: 'Téléchargement',
			template: 'Etes vous sur de vouloir télécharger cette rando ?'
		}).then(function (res) {
			if (res) {

				nbDownloads = 2 + trek.properties.children.length * 2;

				$scope.downloadButton = 'hide';
				$scope.loadingBar = '';
				loadingBar.style.width = '0%';

				TreksFactory.downloadTrek(trek.id).then(function (success) {

					$ionicPopup.alert({
						template: 'Téléchargement terminé'
					}).then(function (res) {
						$ionicHistory.nextViewOptions({	disableBack: true });
						$state.go('root.detailed_trek', { trekId: trek.id });
					});

				}, function (error) {
					console.log(error);
				}, function (progress) {
					loadingBar.style.width = String((progress.current * (100 / nbDownloads)) + progress.progress / nbDownloads) + '%';
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
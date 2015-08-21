'use strict';

function trekPreviewController($ionicHistory, $state, $rootScope, $scope, $ionicPopup, $timeout, trek, constants, settings, utils, TreksFactory) {

	$scope.downloadTrek = function () {

		var loadingBar;
		var nbDownloads;

		$ionicPopup.confirm({
			title: 'Téléchargement',
			template: 'Etes vous sur de vouloir télécharger cette rando ?'
		}).then(function (res) {
			if (res) {

				nbDownloads = 2 + trek.properties.children.length * 2;

				var myPopup = $ionicPopup.show({
					template: '<div id="loading_bar_container"><div id="loading_bar" style="width: {{ loading }}"></div></div>',
					title: 'Téléchargement en cours',
					scope: $scope
				});

				$scope.downloadButton = 'hide';
				$scope.loadingBar = '';
				$scope.loading = '0%';

				TreksFactory.downloadTrek(trek.id).then(function (success) {

					$timeout(function () {
						myPopup.close();
						$timeout(function () {
							$rootScope.$emit('treksChanged', {});
							$ionicPopup.alert({
								template: 'Téléchargement terminé'
							}).then(function (res) {
								$ionicHistory.nextViewOptions({	disableBack: true });
								$state.go('root.detailed_trek', { trekId: trek.id });
							});
						}, 200);
					}, 200);

				}, function (error) {
					console.log(error);
				}, function (progress) {
					$scope.loading = String((progress.current * (100 / nbDownloads)) + progress.progress / nbDownloads) + '%';
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
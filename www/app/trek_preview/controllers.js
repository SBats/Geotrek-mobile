'use strict';

function trekPreviewController($ionicHistory, $state, $rootScope, $scope, $ionicPopup, $timeout, trek, translations, constants, settings, utils, TreksFactory) {

	$scope.downloadTrek = function () {

		var loadingBar;
		var nbDownloads;

		$ionicPopup.confirm({
			title: translations['trek_preview.download'],
			template: translations['trek_preview.confirm_download']
		}).then(function (res) {
			if (res) {

				nbDownloads = 2 + trek.properties.children.length * 2;

				var myPopup = $ionicPopup.show({
					title: translations['trek_preview.downloading'],
					template: '<div id="loading_bar_container"><div id="loading_bar" style="width: {{ loading }}"></div></div>',
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
								template: translations['trek_preview.downloaded']
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

module.exports = {
	trekPreviewController: trekPreviewController
};
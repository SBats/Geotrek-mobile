'use strict';

function initController($ionicHistory, $state, $scope, translations, constants, settings, InitService, LanguageService, LeafletService) {

	console.log(translations);
	$ionicHistory.nextViewOptions({	disableBack: true });
	if (angular.isUndefined(window.localStorage.syncMode)) {
		window.localStorage.syncMode = 'all';
	}
	if (angular.isUndefined(window.localStorage.alertOnPoi)) {
		window.localStorage.alertOnPoi = true;
	}

	if (settings.isDevice) {
		InitService.getDeviceFiles(translations).then(function (res) {

			var validState = false;
			var states = $state.get();

			if (window.localStorage.alertOnPoi) {
				LeafletService.startWatchPosition();
			}
			if (!settings.isConnected) {
				$scope.$parent.hide = false;
			}
			angular.forEach(states, function (state) {
				if (state.name === res) {
					validState = true;
				}
			});
			$state.go(validState ? res : 'root.map.global');
		}, function (error) {
			console.log(error);
		}, function (state) {
			$scope.state = state;
		});
	}
	else {
		if (angular.isUndefined(window.localStorage.downloads)) {
			window.localStorage.downloads = JSON.stringify({});
		}
		LanguageService.applyInterfaceLang();
		$scope.state = 'init.loading_translations';
		LanguageService.applyTreksLang().then(function (res) {
			$scope.state = 'init.done';
			$state.go(constants.CONNECTED_REDIRECTION);
		});
	}
}

module.exports = {
	initController: initController
};
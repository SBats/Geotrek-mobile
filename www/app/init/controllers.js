'use strict';

function initController($ionicHistory, $state, $scope, $translate, constants, settings, InitService, LanguageService) {

	$ionicHistory.nextViewOptions({	disableBack: true });
	if (angular.isUndefined(window.localStorage.syncMode)) {
		window.localStorage.syncMode = 'all';
	}

	if (settings.isDevice) {
		InitService.getDeviceFiles().then(function (res) {

			var validState = false;
			var states = $state.get();

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
		$scope.state = 'Loading translations';
		LanguageService.applyTreksLang().then(function (res) {
			LanguageService.applyInterfaceLang();
			$scope.state = 'Done, redirecting';
			$state.go(constants.CONNECTED_REDIRECTION);
		});
	}
}

module.exports = {
	initController: initController
};
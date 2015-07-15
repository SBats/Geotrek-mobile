'use strict';

function initController($ionicHistory, $state, $scope, constants, settings, InitService) {

	$ionicHistory.nextViewOptions({	disableBack: true });
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
		});
	}
	else {
		$state.go(constants.CONNECTED_REDIRECTION);
	}
}

module.exports = {
	initController: initController
};
'use strict';

function initController($ionicHistory, $state, constants, settings, InitService) {

	$ionicHistory.nextViewOptions({	disableBack: true });
	if (settings.isDevice) {
		InitService.getDeviceFiles().then(function (res) {

			var validState = false;
			var states = $state.get();

			angular.forEach(states, function (state) {
				if (state.name === res) {
					validState = true;
				}
			});
			$state.go(validState ? res : 'root.map.global');
		});
	}
	else {
		$state.go('root.map.global');
	}
}

module.exports = {
	initController: initController
};
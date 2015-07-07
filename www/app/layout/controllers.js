'use strict';

function LayoutController($cordovaNetwork, $scope, settings) {

	$scope.closeNotif = function() {
		document.getElementById('disconnected_notification').style.top = '0px';
	};

	$scope.hide = true;
}

module.exports = {
    LayoutController: LayoutController
};
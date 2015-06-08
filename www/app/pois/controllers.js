'use strict';

function poiController($scope, $ionicHistory, $state, $stateParams, poi) {

	$scope.goBackToTrek = function () {
		$ionicHistory.nextViewOptions({	disableBack: true });
		$state.go('root.map.detailed', { trekId: $stateParams.trekId });
	};
	$scope.pictures = poi.properties.pictures;
}

module.exports = {
	poiController: poiController
};
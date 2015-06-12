'use strict';

function poiController($scope, $ionicHistory, $state, $stateParams, poi) {

	console.log(poi);

	$scope.goBackToTrek = function () {
		$ionicHistory.nextViewOptions({	disableBack: true });
		if ($stateParams.view && $stateParams.view === "map") {
			$state.go('root.map.detailed', { trekId: $stateParams.trekId });
		}
		else {
			$state.go('root.detailed_trek', { trekId: $stateParams.trekId });
		}
	};
	$scope.poi = poi;
	$scope.title = poi.properties.name;
}

module.exports = {
	poiController: poiController
};
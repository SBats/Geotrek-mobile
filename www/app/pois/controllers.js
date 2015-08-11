'use strict';

function poiController($scope, $ionicHistory, $state, $stateParams, poi, trek, LeafletService, NotificationService) {

	console.log(poi);
	$scope.poi = poi;
	$scope.title = poi.properties.name;
}

module.exports = {
	poiController: poiController
};
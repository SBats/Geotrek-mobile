'use strict';

function poiController($scope, $ionicHistory, $state, $stateParams, poi, trek, LeafletService, NotificationService) {

	$scope.poi = poi;
	$scope.title = poi.properties.name;
}

module.exports = {
	poiController: poiController
};
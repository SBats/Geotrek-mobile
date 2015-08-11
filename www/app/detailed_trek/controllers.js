'use strict';

function detailedTrekController($ionicHistory, $state, $scope, $ionicSlideBoxDelegate, trek, pois, utils, constants, settings, TreksService) {

	var tabs = $ionicSlideBoxDelegate.$getByHandle('detailed_trek_tabs');

	$scope.switchToMap = function () {
		$ionicHistory.nextViewOptions({	disableBack: true });
		$state.go('root.map.detailed', { trekId: trek.id });
	};

	$scope.changeTab = function (slideNb, id) {
		tabs.slide(slideNb);
		$scope.selected = id;
	};

	$scope.trek = trek;
	$scope.pois = pois;
	$scope.selected = 'infos';
}

module.exports = {
	detailedTrekController: detailedTrekController
};
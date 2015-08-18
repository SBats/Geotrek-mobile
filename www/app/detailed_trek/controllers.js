'use strict';

function detailedTrekController($ionicHistory, $state, $stateParams, $scope, $ionicSlideBoxDelegate, treks, pois, utils, constants, settings, TreksFactory) {

	var tabs = $ionicSlideBoxDelegate.$getByHandle('detailed_trek_tabs');
	var trek = treks[$stateParams.trekId];
	var children = {};

	$scope.switchToMap = function () {
		$ionicHistory.nextViewOptions({	disableBack: true });
		$state.go('root.map.detailed', { trekId: trek.id });
	};

	$scope.changeTab = function (slideNb, id) {
		tabs.slide(slideNb);
		$scope.selected = id;
	};


	if (trek.properties.parent) {
		trek.properties.parent = (treks[trek.properties.parent].isDownloaded ? treks[trek.properties.parent] : null);
	}
	if (trek.properties.next) {
		trek.properties.next = (treks[trek.properties.next].isDownloaded ? treks[trek.properties.next] : null);
	}
	if (trek.properties.previous) {
		trek.properties.previous = (treks[trek.properties.previous].isDownloaded ? treks[trek.properties.previous] : null);
	}
	if (trek.properties.children.length > 0) {
		angular.forEach(trek.properties.children, function (child) {
			if (!settings.isDevice || treks[child].isDownloaded) {
				children[child] = treks[child];
			}
		});
		trek.properties.children = children;
	}
	$scope.trek = trek;
	$scope.pois = pois;
	$scope.selected = 'infos';
}

module.exports = {
	detailedTrekController: detailedTrekController
};
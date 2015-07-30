'use strict';

function mapController($state, $rootScope, $scope, $stateParams, LeafletService) {

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		if (fromState.name === 'root.map.detailed' || fromState.name === 'root.map.global') {
			LeafletService.clearMapLayers();
			LeafletService.stopWatch();
		}
	});

	$scope.locate = function () {
		LeafletService.followUser();
	};
}

function globalMapController($rootScope, $scope, LeafletService) {

	LeafletService.setGlobalSettings();

	$scope.$parent.isGlobal = true;
	$scope.$parent.isDetailed = false;
	$scope.$parent.title = 'Carte';
}

function detailedMapController($ionicHistory, $rootScope, $scope, $state, constants, settings, utils, trek, TreksService, LeafletService) {

	$scope.$parent.switchToText = function () {
		$ionicHistory.nextViewOptions({	disableBack: true });
		$state.go('root.detailed_trek', { trekId: trek.id });
	};

	$scope.$parent.isGlobal = false;
	$scope.$parent.isDetailed = true;
	$scope.$parent.trek = trek;
	$scope.$parent.title = trek.properties.name;

	LeafletService.setDetailedSettings(trek);
}

function mapDirectiveController($scope) {
	var map = document.getElementById('map');
	var body = document.body,
	html = document.documentElement;
	var height = Math.max(body.scrollHeight, body.offsetHeight,
		html.clientHeight, html.scrollHeight, html.offsetHeight);
	
	if ($scope.size === 'big') {
		map.style.height = (height - 44) + 'px';
		window.addEventListener('resize', function (event) {
			height = Math.max(body.scrollHeight, body.offsetHeight,
				html.clientHeight, html.scrollHeight, html.offsetHeight);
			map.style.height = (height - 44) + 'px';
		});		
	}
	else if ($scope.size === 'small') {
		map.style.width = '100%';
		map.style.height = '250px';
	}
}

module.exports = {
	mapController: mapController,
	globalMapController: globalMapController,
	detailedMapController: detailedMapController,
	mapDirectiveController: mapDirectiveController
};
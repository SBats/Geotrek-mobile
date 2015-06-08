'use strict';

function mapController($state, $rootScope, $scope, $stateParams, LeafletService) {

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		if (fromState.name === 'root.map.detailed' || fromState.name === 'root.map.global') {
			LeafletService.clearMapLayers();
		}
	});
}

function globalMapController($rootScope, $scope, LeafletService) {

	LeafletService.setGlobalSettings();

	$scope.$parent.hideButtons = 'hide';
	$scope.$parent.title = 'Global map';
}

function detailedMapController($ionicHistory, $rootScope, $scope, $state, trek, TreksService, LeafletService, FavoritesService) {

	$scope.$parent.switchToText = function () {
		$ionicHistory.nextViewOptions({	disableBack: true });
		$state.go('root.detailed_trek', { trekId: trek.id });
	};

	$scope.$parent.addToFavorites = function () {
		FavoritesService.changeFavorites(trek.id);
		$scope.$parent.isFavorite = FavoritesService.isFavorite(trek.id);
	};
	$scope.$parent.isFavorite = FavoritesService.isFavorite(trek.id);
	$scope.$parent.hideButtons = '';
	$scope.$parent.trek = trek;
	$scope.$parent.title = 'Detailed map';

	LeafletService.setDetailedSettings(trek);
}

function mapDirectiveController() {
	var map = document.getElementById('map');
	var body = document.body,
		html = document.documentElement;
	var height = Math.max(body.scrollHeight, body.offsetHeight,
					   html.clientHeight, html.scrollHeight, html.offsetHeight);
	
	map.style.height = (height - 44) + 'px';
	window.addEventListener('resize', function (event) {
		height = Math.max(body.scrollHeight, body.offsetHeight,
			html.clientHeight, html.scrollHeight, html.offsetHeight);
		map.style.height = (height - 44) + 'px';
	});
}

module.exports = {
	mapController: mapController,
	globalMapController: globalMapController,
	detailedMapController: detailedMapController,
	mapDirectiveController: mapDirectiveController
};
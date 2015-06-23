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
	$scope.$parent.title = 'Carte';
}

function detailedMapController($ionicHistory, $rootScope, $scope, $state, constants, settings, utils, trek, TreksService, LeafletService, FavoritesService) {

	$scope.$parent.switchToText = function () {
		$ionicHistory.nextViewOptions({	disableBack: true });
		$state.go('root.detailed_trek', { trekId: trek.id });
	};

	$scope.$parent.downloadTrek = function () {
		TreksService.deleteOrDownload(trek.id).then(function (res) {
			$scope.$parent.isDownloaded = (res === constants.TREK_DOWNLOADED);
			if (!FavoritesService.isFavorite(trek.id)) {
				FavoritesService.changeFavorites(trek.id);
				$scope.$parent.isFavorite = FavoritesService.isFavorite(trek.id);
			}
		});
	};

	$scope.$parent.addToFavorites = function () {
		FavoritesService.changeFavorites(trek.id);
		$scope.$parent.isFavorite = FavoritesService.isFavorite(trek.id);
	};
	TreksService.isTrekDownloaded(trek.id).then(function (res) { $scope.$parent.isDownloaded = res; });
	$scope.$parent.isFavorite = FavoritesService.isFavorite(trek.id);
	$scope.$parent.hideButtons = '';
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
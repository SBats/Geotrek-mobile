'use strict';

function mapController($state, $rootScope, $scope, $stateParams) {


}

function globalMapController($rootScope, $scope, LeafletService) {

	function refreshMap() {
		LeafletService.setGlobalSettings();
		LeafletService.makeTreksLayer();
	}
	refreshMap();

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		if (toState.name === 'root.map.global') {
			refreshMap();
		}
	});
}

function detailedMapController($rootScope, $scope, $stateParams, TreksService, LeafletService, FavoritesService) {

	$scope.addToFavorites = function () {
		FavoritesService.changeFavorites($stateParams.trekId);
		$scope.isFavorite = FavoritesService.isFavorite($stateParams.trekId);
	};
	$scope.isFavorite = FavoritesService.isFavorite($stateParams.trekId);

	function refreshMap() {
		TreksService.getTrek($stateParams.trekId).then(function (trek) {
			LeafletService.setDetailedSettings(trek);				
		});
	}
	refreshMap();

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		if (toState.name === 'root.map.detailed') {
			refreshMap();
		}
	});
}

function mapDirectiveController() {

}

module.exports = {
	mapController: mapController,
	globalMapController: globalMapController,
	detailedMapController: detailedMapController,
	mapDirectiveController: mapDirectiveController
};
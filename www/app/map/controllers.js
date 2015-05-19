'use strict';

function mapController() {
}

function leafletMapController($rootScope, $scope, $state, LeafletService, FiltersFactory) {

	var map = LeafletService.getMap();
	var treksOnMap = new L.featureGroup();

	function makeTreksLayer() {
		var marker;

		FiltersFactory.getFilteredTreks().then(function (treks) {
			angular.forEach(treks, function (trek) {
				marker = LeafletService.getMarkerFromTrek(trek);
				marker.on('click', function () {
					$state.go('root.detailed_trek', { trekId: trek.id });
				});
				treksOnMap.addLayer(marker);
			});
			map.addLayer(treksOnMap);
		});
	}

	function refreshMap() {
		treksOnMap.clearLayers();

		if ($scope.view === 'global') {
			LeafletService.setGlobalSettings(map);
			makeTreksLayer();
		}
	}

	refreshMap();

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		if (toState.name === 'root.map') {
			refreshMap();
		}
	});
}

module.exports = {
	mapController: mapController,
	leafletMapController: leafletMapController
};
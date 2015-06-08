'use strict';

function filtersController($rootScope, $scope, filters, filteredTreks, FiltersFactory, TreksService) {

	$scope.filters = filters;
	$scope.nbResults = filteredTreks.length;

	$scope.setOption = function (filter, option) {
		filters[filter][option].isActive = !filters[filter][option].isActive;
		FiltersFactory.getFilteredTreks().then(function (treks) {
			$scope.nbResults = treks.length;
		});
	};
}

module.exports = {
	filtersController: filtersController
};
'use strict';

function filtersController($rootScope, $scope, filters, filteredTreks, FiltersFactory, TreksService) {

	$scope.filters = filters;
	$scope.nbResults = filteredTreks.length;

	$scope.setOption = function (filter, option) {
		filters[filter][option].isActive = !filters[filter][option].isActive;
		$rootScope.$emit('filtersChange');
	};

	$rootScope.$on('nbResults', function (e, data) {
		$scope.nbResults = data.nbResults;
	});

}

module.exports = {
	filtersController: filtersController
};
'use strict';

function filtersController($rootScope, $state, $scope, filters, filteredTreks, FiltersFactory, TreksFactory) {

	var filtersChanged = false;
	var stateName = $state.current.name;

	$scope.filters = filters;
	$scope.nbResults = filteredTreks.length;

	$scope.setOption = function (filter, option) {

		filtersChanged = true;
		filters[filter][option].isActive = !filters[filter][option].isActive;
		FiltersFactory.getFilteredTreks().then(function (treks) {
			$scope.nbResults = treks.length;
		});
	};

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		if (stateName === fromState.name) {

			if (filtersChanged) {

				$rootScope.$emit('filtersChanged', {});
				filtersChanged = false;
			}
		}
	});
}

module.exports = {
	filtersController: filtersController
};
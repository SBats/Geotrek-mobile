'use strict';

function listDisplayController($rootScope, $scope, TreksService, FiltersFactory) {

	var refreshTreks = function () {
		FiltersFactory.getFilteredTreks().then(function (treks) {
			$scope.treks = treks;
			$rootScope.$emit('nbResults', { nbResults: treks.length });
		});
	}

	refreshTreks();

	$rootScope.$on('filtersChange', function (e) {
		refreshTreks();
	});

}

module.exports = {
	listDisplayController: listDisplayController
}
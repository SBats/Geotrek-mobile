'use strict';

function listDisplayController($rootScope, $scope, TreksService, FiltersFactory) {

	var refreshTreks = function () {
		FiltersFactory.getFilteredTreks().then(function (treks) {
			$scope.treks = treks;
		});
	};

	refreshTreks();

}

module.exports = {
	listDisplayController: listDisplayController
};
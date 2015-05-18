'use strict';

function filtersFactory($q, TreksService) {

	//Filters initialization, durations are always the same, difficulies and practices are set in getFilters()
	var filters = {
		difficulties: {},
		durations: {
			'-6h': {isActive: false},
			'6h - 12h': {isActive: false},
			'+12h': {isActive: false}
		},
		practices: {}
	};

	var formatFilters = function () {
		var tmpFilter = {};

		angular.forEach(filters, function (filter, index) {	
			tmpFilter = {};
			angular.forEach(filter, function (option) {
				tmpFilter[option] = false;
			});
			filters[index] = tmpFilter;
		});
	};

	//Gets the difficulties and practices filters by searching the treks
	var getFilters = function () {
		var	deferred = $q.defer();

		if (filters) {
			deferred.resolve(filters);
		}

		TreksService.getTreks().then(function (treks) {
			angular.forEach(treks.features, function (trek) {
				if (!filters.difficulties[trek.properties.difficulty.label]) {
					filters.difficulties[trek.properties.difficulty.label] = {
						isActive: false,
						id: trek.properties.difficulty.id
					};
				}
				if (!filters.practices[trek.properties.practice.label]) {
					filters.practices[trek.properties.practice.label] = {
						isActive: false,
						id: trek.properties.practice.id
					};
				}
			});
			deferred.resolve(filters);
		});

		return (deferred.promise);
	};

	//Checks if all the options on the filter are false. If they are, it acts like they are all on true
	var checkAllFalse = function (filter) {
		var allFalse = true;

		angular.forEach(filter, function (optionValue) {
			allFalse = allFalse && !optionValue.isActive;
		});
		return (allFalse);
	};

	//Checking functions for all the filters
	var checkDifficulty = function (trek) {
		return (checkAllFalse(filters.difficulties) || filters.difficulties[trek.properties.difficulty.label].isActive);
	};

	var checkTime = function (trek) {
		var duration = (trek.properties.duration < 6) ? '-6h' : ((trek.properties.duration < 12) ? '6h - 12h' : '+12h');

		return (checkAllFalse(filters.durations) || filters.durations[duration].isActive);
	};

	var checkPractice = function (trek) {
		return (checkAllFalse(filters.practices) || filters.practices[trek.properties.practice.label].isActive);
	};

	//Gets the treks after applying the filters
	var getFilteredTreks = function () {
		var filteredTreks = [];
		var	deferred = $q.defer();

		getFilters().then(function (filters) {
			TreksService.getTreks().then(function (treks) {
				angular.forEach(treks.features, function (trek) {
					if (checkDifficulty(trek) && checkTime(trek) && checkPractice(trek)) {
						filteredTreks.push(trek);
					}
				});
				deferred.resolve(filteredTreks);
			});
		});
		return (deferred.promise);
	};

	return ({
		getFilters: getFilters,
		getFilteredTreks: getFilteredTreks
	});

}

module.exports = {
	filtersFactory: filtersFactory
}
'use strict';

var controllers = require('./controllers');

function filtersRoutes($stateProvider) {
	
	$stateProvider
	.state('root.filters', {
		url: "/filters",
		resolve: {
			filters: function(FiltersFactory) {
				return (FiltersFactory.getFilters());
			},
			filteredTreks: function(FiltersFactory) {
				return (FiltersFactory.getFilteredTreks());
			}
		},
		views: {
			'content': {
				template: require('./templates/filters.html'),
				controller: controllers.filtersController
			}
		}
	});
}

module.exports = {
	filtersRoutes: filtersRoutes
};
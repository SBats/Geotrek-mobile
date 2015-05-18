'use strict';

angular.module('app.filters', [])

.controller('FiltersController', require('./controllers').filtersController)

.factory('FiltersFactory', require('./factories').filtersFactory)

.config(require('./routes').filtersRoutes);
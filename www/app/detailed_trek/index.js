'use strict';

angular.module('app.detailed_trek', [])

.controller('DetailedTrekController', require('./controllers').detailedTrekController)

.config(require('./routes').detailedTrekRoutes);
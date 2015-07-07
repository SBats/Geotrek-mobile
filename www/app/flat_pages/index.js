'use strict';

angular.module('app.flat_pages', [])

.controller('FlatPagesController', require('./controllers').flatPagesController)

.controller('FlatPageController', require('./controllers').flatPageController)

.service('FlatPagesServices', require('./services').flatPagesServices)

.config(require('./routes').flatPagesRoutes);
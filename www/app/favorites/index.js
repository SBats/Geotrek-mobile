'use strict';

angular.module('app.favorites', [])

.controller('FavoritesController', require('./controllers').favoritesController)

.service('FavoritesService', require('./services').favoritesService)

.config(require('./routes').favoritesRoutes);
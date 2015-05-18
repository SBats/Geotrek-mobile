'use strict';

window.angular.module('app.layout', ['ui.router'])

.config(require('./routes').layoutRoutes);
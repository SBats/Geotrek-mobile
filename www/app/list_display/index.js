'use strict';

window.angular.module('app.list_display', [])

.controller('ListDisplayController', require('./controllers').listDisplayController)

.config(require('./routes').listDisplayRoutes);
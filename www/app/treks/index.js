'use strict';

window.angular.module('app.treks', [])

.service('TreksService', require('./services').treksService);
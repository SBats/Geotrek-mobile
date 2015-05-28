'use strict';

window.angular.module('app.init', [])

.service('init', require('./init').initService);
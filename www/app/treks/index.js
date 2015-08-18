'use strict';

window.angular.module('app.treks', [])

.factory('TreksFactory', require('./factories').treksFactory)

.service('TreksRemoteService', require('./services').TreksRemoteService)

.service('TreksFileSystemService', require('./services').TreksFileSystemService);
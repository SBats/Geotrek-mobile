'use strict';

window.angular.module('app.notification', [])

.service('NotificationService', require('./services').notificationService);
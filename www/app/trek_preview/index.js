'use strict';

angular.module('app.trek_preview', [])

.controller('TrekPreviewController', require('./controllers').trekPreviewController)

.service('TrekPreviewService', require('./services').trekPreviewService)

.config(require('./routes').trekPreviewRoutes);
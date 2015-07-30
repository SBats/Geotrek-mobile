'use strict';

window.angular.module('app.language', [])

.config(require('./config').languageConfig)

.service('LanguageService', require('./services').languageService);

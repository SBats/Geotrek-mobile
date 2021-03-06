'use strict';

var geotrekUserSettings = angular.module('geotrekUserSettings');

geotrekUserSettings.controller('UserSettingsController',
    ['$ionicPlatform', '$rootScope', '$state', '$scope', 'settings', '$q', '$ionicPopup', 'utils', 'globalSettings', '$cordovaFile', '$translate','localeSettings', 'userSettingsService', 'networkSettings', 'globalizationService', 'mapFactory', 'treksFactory', 'logging',
    function ($ionicPlatform, $rootScope, $state, $scope, settings, $q, $ionicPopup, utils, globalSettings, $cordovaFile, $translate, localeSettings, userSettingsService, networkSettings, globalizationService, mapFactory, treksFactory, logging) {

    // To have a correct 2-ways binding, localeSettings and networkSettings are used for
    // 1/ select markup initialization
    function getAvailableLanguages() {
        var availableLanguages = {},
            langLength = 0;
        angular.forEach(localeSettings, function (language, languageCode) {
            if (globalSettings.AVAILABLE_LANGUAGES.indexOf(languageCode) > -1) {
                availableLanguages[languageCode] = language;
                langLength ++;
            }
        });
        $scope.languages = availableLanguages;
        $scope.langLength = langLength;
    }
    getAvailableLanguages();
    $scope.connections = networkSettings;

    function somethingToDelete () {
        if (window.cordova) {
            $cordovaFile.listDir(settings.device.RELATIVE_TILES_ROOT)
                .then(function(listFiles) {
                    var detailedTilesArePresent = false;
                    for (var i = listFiles.length - 1; i >= 0; i--) {
                        var currentFile = listFiles[i];
                        if (currentFile.isDirectory && parseInt(currentFile.name, 10) > 12) {
                            detailedTilesArePresent = true;
                        }
                    }
                    $scope.cleanIsDisabled = !detailedTilesArePresent;
                });
        } else {
            $scope.cleanIsDisabled = false;
        }
    }

    somethingToDelete();

    // AND
    // 2/ initialize select with saved user settings
    userSettingsService.getUserSettings().then(function(userSettings){
            var scopeUserSettings = {
                currentLanguage: localeSettings[userSettings.currentLanguage],
                synchronizationMode: networkSettings[userSettings.synchronizationMode],
                alertOnPois: userSettings.alertOnPois
            };
            $scope.userSettings = scopeUserSettings;
        }
    );

    // If current language is modified, translating text
    $scope.$watch('userSettings.currentLanguage', function() {
        var chosenLanguage = $scope.userSettings.currentLanguage.locale;
        globalizationService.translateTo(chosenLanguage);
    });

    // If user settings are modified, saving them
    $scope.$watch('userSettings', function() {
        userSettingsService.saveUserSettings($scope.userSettings);
    }, true);

    $scope.cleanFiles = function() {
        $translate([
            'usersettings_controller_cleanmaps_confirm_title',
            'usersettings_controller_cleanmaps_confirm_label',
            'user_parameters.cancel'
        ]).then(function(translations) {
            var confirmPopup = $ionicPopup.confirm({
                title: translations.usersettings_controller_cleanmaps_confirm_title,
                template: translations.usersettings_controller_cleanmaps_confirm_label,
                cancelText: translations['user_parameters.cancel']
            });

            confirmPopup.then(function(confirmed) {
                if(confirmed) {
                    utils.showSpinner();
                    $q.all([
                        mapFactory.cleanDownloadedLayers()
                        .then(
                            function(result) {
                            }, function(error) {
                                logging.error(error);
                            }
                        ),
                        treksFactory.removeDownloadedImages()
                        .then(
                            function() {
                            }, function(error) {
                                console.error(error);
                            }
                        )
                    ])
                    .then(
                        function(result) {
                            // Disabling delete button to inform user that delete is done
                            $scope.cleanIsDisabled = true;
                            utils.hideSpinner();
                        }, function(error) {
                            console.error(error);
                        }
                    );
                }
            });
        });
    };

    $scope.exitApp = function() {
        ionic.Platform.exitApp()
    };

}]);

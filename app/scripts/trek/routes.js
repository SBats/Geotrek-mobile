'use strict';

var geotrekApp = angular.module('geotrekMobileApp');

geotrekApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/trek');

    $stateProvider
    .state('home', {
        url: '',
        abstract: true,
        templateUrl: 'views/nav_trek_map.html',
        controller: 'TrekController'
    })
    .state('home.trek', {
        url: '/trek',
        templateUrl : 'views/trek_list.html',
        controller: 'TrekListController'
    })
    .state('home.trek.detail', {
        url: '/:trekId',
        controller: 'TrekDetailController'
    })
});

geotrekApp.controller('TrekController', function ($scope, $state, $window, $ionicActionSheet, $ionicModal, TreksFilters) {

    // Define utils variables for specific device behaviours
    $scope.isAndroid = $window.ionic.Platform.isAndroid() || $window.ionic.Platform.platforms[0] === 'browser';
    $scope.isIOS = $window.ionic.Platform.isIOS();

    // Define filters from service to the scope for the view
    $scope.filtersData = {
        difficulties : TreksFilters.difficulties,
        durations    : TreksFilters.durations,
        elevations   : TreksFilters.elevations,
        themes       : TreksFilters.themes,
        communes     : TreksFilters.communes
    };

    // Prepare an empty object to store currently selected filters
    $scope.activeFilters = {
        difficulty: undefined,
        duration:   undefined,
        elevation:  undefined,
        theme:      undefined,
        commune:    null,
        search:     ''
    };

    // Give access to state data to our View for active state
    $scope.$state = $state;

    // Show search input or not
    $scope.showSearch = {
        search : 0 // Hidden by default
    };

    // Filter treks everytime our filters change
    $scope.filterTreks = function (trek) {
        if (filterTrekWithFilter(trek.properties.difficulty.id, $scope.activeFilters.difficulty) &&
            filterTrekWithFilter(trek.properties.duration, $scope.activeFilters.duration) &&
            filterTrekWithFilter(trek.properties.ascent, $scope.activeFilters.elevation) &&
            filterTrekWithThemes(trek.properties.themes, $scope.activeFilters.theme) &&
            filterTrekWithCities(trek.properties.cities, $scope.activeFilters.commune)) {
            return true;
        }
        return false;
    };

    $scope.resetFilters = function () {
        $scope.activeFilters = {
            difficulty: undefined,
            duration:   undefined,
            elevation:  undefined,
            theme:      undefined,
            commune:    null,
            search:     ''
        };
    };

    $scope.cancelBtHandler = function () {
        $scope.showSearch.search = 0;
        $scope.activeFilters.search = '';
    };

    // Triggered on a button click, or some other target
    $scope.showMore = function () {
        // Show the action sheet
        $ionicActionSheet.show({
            buttons: $scope.staticPages,
            cancel: function() {

            },
            buttonClicked: function(index) {
                createModal($scope.staticPages[index].text);

                return true;
            }
        });
    };

    function filterTrekWithFilter(trekValue, filter) {
        // Trek considered as matching if filter not set or if
        // property is empty.
        if (trekValue === undefined ||
            angular.isUndefined(filter) ||
            filter === null) {
            return true;
        }

        if (trekValue <= filter) {
            return true;
        } else {
            return false;
        }
    }

    function filterTrekWithThemes(themesValues, value) {
        var isMatching = false;
        // Trek considered as matching if filter not set or if
        // property is empty.
        angular.forEach(themesValues, function(themeValue) {
            if (themeValue.id === undefined ||
                angular.isUndefined(value) ||
                value === null) {
                isMatching = true;
            }

            if (themeValue.id === value) {
                isMatching = true;
            }
        });

        return isMatching;
    }

    function filterTrekWithCities(citiesValues, value) {
        var isMatching = false;
        // Trek considered as matching if filter not set or if
        // property is empty.
        angular.forEach(citiesValues, function(cityValue) {
            if (cityValue.code === undefined ||
                angular.isUndefined(value) ||
                value === null) {
                isMatching = true;
                return;
            }

            if (cityValue.code === value.value) {
                isMatching = true;
            }
        });

        return isMatching;
    }

    function createModal(template) {
        // Display the modal (this is the entire view here)
        var modal = $ionicModal.fromTemplate(template, {
            scope: $scope,
            animation: 'slide-in-up'
        });
        modal.show();

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
    }

    // Watch for changes on filters, then reload the treks to keep them synced
    $scope.$watchCollection('activeFilters', function() {
        $scope.$broadcast('OnFilter');
    });
})
.controller('TrekListController', function () {
    // Default ordering is already alphabetical, so we comment this line
    // $scope.orderProp = 'properties.name';
})
.controller('TrekDetailController', function ($scope, $ionicModal, $stateParams, $sce, TreksData, SocialSharing) {
    console.log($stateParams);

    $scope.trekId = $stateParams.trekId;

    // Get current trek data from the treks file
    TreksData.getTrek($stateParams.trekId).then(function(trek) {
        $scope.trek = trek;

        // We need to declare our json HTML data as safe using $sce
        $scope.teaser = $sce.trustAsHtml(trek.properties.description_teaser);
    });

    // Display the modal (this is the entire view here)
    $ionicModal.fromTemplateUrl('views/trek_detail.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.share = function() {
        SocialSharing.share($scope.trek.properties.name);
    };
})
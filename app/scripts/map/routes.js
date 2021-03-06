'use strict';

var geotrekMap = angular.module('geotrekMap', []);

geotrekMap.config(function($stateProvider) {

    $stateProvider
        .state('home.map', {
            url: '/map',
            templateUrl: 'views/global_map.html',
            controller: 'MapController',
            resolve: {
                mapParameters: function(leafletService) {
                    return leafletService.getMapInitParameters();
                }
            }
        })
        .state('home.map.trek', {
            url: '/map-:trekId?parentId',
            templateUrl: 'views/detail_map.html',
            controller: 'MapControllerDetail',
            resolve: {
                trek: function($stateParams, treksFactory) {
                    return treksFactory.getTrek($stateParams.trekId);
                },
                pois: function(poisFactory, $stateParams) {
                    return poisFactory.getPoisFromTrek($stateParams.trekId);
                },
                touristics: function(touristicsFactory, settings, $stateParams) {
                    return (settings.TOURISTIC ? touristicsFactory.getAllTouristicsContentsFromATrek($stateParams.trekId) : []);
                }
            }
        })
        .state('home.map.detail', {
            url: '/trek-:trekId?parentId',
            controller: 'TrekDetailController',
            resolve: {
                trek: function(treksFactory, $stateParams) {
                    return treksFactory.getTrek($stateParams.trekId);
                },
                pois: function(poisFactory, $stateParams) {
                    return poisFactory.getPoisFromTrek($stateParams.trekId);
                },
                touristics: function(touristicsFactory, settings, $stateParams) {
                    return (settings.TOURISTIC ? touristicsFactory.getAllTouristicsContentsFromATrek($stateParams.trekId) : []);
                },
                downloadedTrek: function($q, trek, mapFactory) {
                    var promises = [];
                    promises.push(mapFactory.hasTrekPreciseBackground(trek.id));

                    return $q.all(promises)
                        .then(function(isDownloadedList) {
                            for (var i = 0; i < isDownloadedList.length; i++) {
                                trek['tiles'] = {
                                    isDownloaded: isDownloadedList[i]
                                };
                            }
                        });
                }
            }
        });
});

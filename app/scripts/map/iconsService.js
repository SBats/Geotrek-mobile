'use strict';

var geotrekMap = angular.module('geotrekMap');

/**
 * Service that persists and retrieves treks from data source
 */
geotrekMap.service('iconsService', ['$window', function ($window) {

    var trek_icons = {
        default_icon: {},
        departure_icon: L.icon({
            iconUrl: 'images/departure.svg',
            iconSize: [60, 50],
            iconAnchor: [38, 50],
            labelAnchor: [38, 50]
        }),
        arrival_icon: L.icon({
            iconUrl: 'images/arrival.svg',
            iconSize: [60, 50],
            iconAnchor: [18, 50],
            labelAnchor: [18, 50]
        }),
        departure_arrival_icon: L.icon({
            iconUrl: 'images/departure-arrival.svg',
            iconSize: [60, 50],
            iconAnchor: [30, 50],
            labelAnchor: [30, 50]
        }),
        parking_icon: L.icon({
            iconUrl: 'images/parking.png',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        }),
        information_icon: L.icon({
            iconUrl: 'images/information.svg',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        }),
        poi_icon: L.icon({
            iconSize: [40, 40],
            labelAnchor: [20, -50]
        })
    };

    this.getPOIIcon = function(poi) {
        return new L.DivIcon({
            html: '<div class="type-icon"><img src="' + poi.properties.type.pictogram + '"/></div>',
            iconSize: [34, 50],
            iconAnchor: [17, 50],
            className: 'poi-icon poi-' + poi.properties.type.id
        });
    };

    this.getStepIcon = function(numberStep) {
        return new L.DivIcon({
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            className: 'step-icon',
            html: '<span class="count">' + numberStep + '</span>'
        });
    };

    this.getTouristicIcon = function(touristic) {
        return new L.DivIcon({
            html: '<div class="category-icon"><img src="' + touristic.properties.category.pictogram + '"></div>',
            iconSize: [34, 50],
            iconAnchor: [17, 50],
            className: 'touristic-icon touristic-' + touristic.properties.category.id
        });
    };

    this.getClusterIcon = function(cluster) {
        return new L.DivIcon({
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            className: 'trek-cluster',
            html: '<span class="count">' + cluster.getChildCount() + '</span>'
        });
    };

    this.getDepartureIcon = function() {
        return trek_icons.departure_icon;
    };

    this.getArrivalIcon = function() {
        return trek_icons.arrival_icon;
    };

    this.getDepartureArrivalIcon = function() {
        return trek_icons.departure_arrival_icon;
    };

    this.getParkingIcon = function() {
        return trek_icons.parking_icon;
    };

    this.getInformationIcon = function() {
        return trek_icons.information_icon;
    };

    this.getTrekIcon = function(element) {
        var icon = L.divIcon({
            iconSize: [34, 50],
            iconAnchor: [17, 50],
            className: 'trek-icon'
        });
        if (element.properties) {
            icon.options.className += ' cat-' + element.properties.category.id;
        }
        return icon;
    };

}]);

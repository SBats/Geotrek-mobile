'use strict';

function leafletService($state, constants, settings, utils, FiltersFactory, IconsService) {

	var self = this;

    // Initialiaze the map with default values
	self.map = L.map('map', {
        center: [constants.leaflet.GLOBAL_MAP_CENTER_LATITUDE, constants.leaflet.GLOBAL_MAP_CENTER_LONGITUDE],
        minZoom: constants.leaflet.GLOBAL_MAP_DEFAULT_MIN_ZOOM,
        maxZoom: constants.leaflet.GLOBAL_MAP_DEFAULT_MAX_ZOOM,
        scrollWheelZoom: true,
        zoomControl: false,
        layers: L.tileLayer(constants.leaflet.LEAFLET_BACKGROUND_URL)
    });
    self.treksOnMap = new L.featureGroup();

    // Returns the map
    this.getMap = function () {
    	return (self.map);
    };

    // Sets markers on each trek's starting point
    this.makeTreksLayer = function () {
        var marker;

        FiltersFactory.getFilteredTreks().then(function (treks) {
            angular.forEach(treks, function (trek) {
                marker = utils.getMarkerFromTrek(trek);
                marker.on('mousedown', function () {
                    $state.go('root.map.detailed', { trekId: trek.id });
                });
                self.treksOnMap.addLayer(marker);
            });
            self.map.addLayer(self.treksOnMap);
        });
    };

    // Sets the defaut position and zoom level when the view is global
    this.setGlobalSettings = function () {
        self.treksOnMap.clearLayers();
    	self.map.setView([constants.leaflet.GLOBAL_MAP_CENTER_LATITUDE, constants.leaflet.GLOBAL_MAP_CENTER_LONGITUDE],
    		constants.leaflet.GLOBAL_MAP_DEFAULT_ZOOM);
    	self.map._layersMinZoom = constants.leaflet.GLOBAL_MAP_DEFAULT_MIN_ZOOM;
    	self.map._layersMaxZoom = constants.leaflet.GLOBAL_MAP_DEFAULT_MAX_ZOOM;
    };

    // Centers the map on the trek and zooms on it
    this.setDetailedSettings = function (trek) {
        var coord = utils.getStartPoint(trek);

        self.treksOnMap.clearLayers();
        self.map.setView([coord.lat, coord.lng], constants.leaflet.GLOBAL_MAP_DEFAULT_ZOOM);
        setTimeout(function () {
            self.map.setZoomAround([coord.lat, coord.lng], constants.leaflet.DETAILED_MAP_DEFAULT_ZOOM);
            self.map._layersMinZoom = constants.DETAILED_MAP_DEFAULT_MIN_ZOOM;
            self.map._layersMaxZoom = constants.DETAILED_MAP_DEFAULT_MAX_ZOOM;
        }, 1000);
    };
}

/**
 * Service that persists and retrieves treks from data source
 */
 function iconsService() {

    var trek_icons = {
        default_icon: {},
        departure_icon: L.icon({
            iconUrl: 'img/map/marker-source.png',
            iconSize: [64, 64],
            iconAnchor: [32, 64],
            labelAnchor: [20, -50]
        }),
        arrival_icon: L.icon({
            iconUrl: 'images/marker-target.png',
            iconSize: [64, 64],
            iconAnchor: [32, 64],
            labelAnchor: [20, -50]
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
        }),
        trek_icon: L.divIcon({
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            className: 'trek-icon',
            labelAnchor: [20, 0]
        })
    };

    this.getPOIIcon = function(poi) {
        var pictogramUrl = poi.properties.type.pictogram;

        return L.icon({
            iconUrl: pictogramUrl,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
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

    this.getParkingIcon = function() {
        return trek_icons.parking_icon;
    };

    this.getInformationIcon = function() {
        return trek_icons.information_icon;
    };

    this.getTrekIcon = function() {
        return trek_icons.trek_icon;
    };

}

module.exports = {
	leafletService: leafletService,
	iconsService: iconsService
};
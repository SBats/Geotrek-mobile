'use strict';

function leafletService($state, settings, utils, FiltersFactory, IconsService) {

	var self = this;

	// Initialiaze the map with default values
	self.map = L.map('map', {
		scrollWheelZoom: true,
		zoomControl: false,
		layers: L.tileLayer(settings.leaflet.LEAFLET_BACKGROUND_URL)
	});
	L.Icon.Default.imagePath = './img/map';

    // Returns the map
    this.getMap = function () {
    	return (self.map);
    };

    // Sets the defaut position and zoom level when the view is global
    this.setGlobalSettings = function (map) {
    	map.setView([settings.leaflet.GLOBAL_MAP_CENTER_LATITUDE, settings.leaflet.GLOBAL_MAP_CENTER_LONGITUDE],
    		settings.leaflet.GLOBAL_MAP_DEFAULT_ZOOM);
    	map._layersMinZoom = settings.leaflet.GLOBAL_MAP_DEFAULT_MIN_ZOOM;
    	map._layersMaxZoom = settings.leaflet.GLOBAL_MAP_DEFAULT_MAX_ZOOM;
    };

    // Place each trek's departure marker on the map
    this.getMarkerFromTrek = function (trek) {
    	var coord;
        var marker;

        coord = utils.getStartPoint(trek);
        marker = L.marker([coord.lat, coord.lng], { icon: IconsService.getDepartureIcon() });
        return (marker);
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
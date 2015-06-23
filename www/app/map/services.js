'use strict';

function leafletService($state, constants, settings, utils, FiltersFactory, IconsService, TreksService, PoisService) {

	var self = this;

	self.trekLayers = {};
	self.tileLayers = {};

	this.makeMap = function (defaultMapSettings, coord, bounds) {
		var center = coord ? coord : [defaultMapSettings.LATITUDE, defaultMapSettings.LONGITUDE];

		self.map = L.map('map', {
			center: center,
			zoom: defaultMapSettings.DEFAULT_ZOOM,
			minZoom: defaultMapSettings.DEFAULT_MIN_ZOOM,
			maxZoom: defaultMapSettings.DEFAULT_MAX_ZOOM,
			scrollWheelZoom: true,
			zoomControl: false,
			maxBounds: bounds,
			layers: L.tileLayer(settings.leafletBackgroundUrl)
		});
	};

	// Remove all custom layers on the map
	this.clearMapLayers = function () {
		angular.forEach(self.trekLayers, function (value, key) {
			if (self.map.hasLayer(value)) {
				self.map.removeLayer(value);
			}
		});
	};

	// Sets markers on each trek's starting point
	this.makeTreksLayer = function () {
		var marker;

		self.trekLayers['global'] = new L.featureGroup();
		FiltersFactory.getFilteredTreks().then(function (treks) {
			angular.forEach(treks, function (trek) {
				marker = utils.getMarkerFromTrek(trek);
				marker.on('click', function () {
					$state.go('root.map.detailed', { trekId: trek.id });
				});
				self.trekLayers['global'].addLayer(marker);
			});
		});
	};

	// Sets the defaut position and zoom level when the view is global
	this.setGlobalSettings = function () {
		var mapContainer = document.getElementById('map').innerHTML;
		var coord = { lat: constants.leaflet.global.LATITUDE, lng: constants.leaflet.global.LONGITUDE };
		var bounds = [ [coord.lat - 0.6, coord.lng - 0.6] , [coord.lat + 0.6, coord.lng + 0.6] ]; 

		if (mapContainer === '') {
			self.makeMap(constants.leaflet.global, coord, bounds);
			self.trekLayers = {};
		}
		else {
			self.map.options.minZoom = constants.leaflet.global.DEFAULT_MIN_ZOOM;
			self.map.options.maxZoom = constants.leaflet.global.DEFAULT_MAX_ZOOM;
			self.map.setZoom(constants.leaflet.global.DEFAULT_ZOOM);
			self.map.setMaxBounds(bounds);
		}
		self.clearMapLayers();
		if (!self.trekLayers['global']) {
			self.makeTreksLayer();
		}
		self.map.addLayer(self.trekLayers['global']);
	};

	// Makes the POI markers
	this.makePois = function (trek) {
		var marker;

		PoisService.getTrekPois(trek.id).then(function (pois) {
			angular.forEach(pois, function (poi) {
				marker = utils.getMarkerFromPoi(poi);
				marker.on('click', function () {
					$state.go('root.poi', { poiId: poi.id, trekId : trek.id, view: 'map' });
				});
				self.trekLayers[trek.id].addLayer(marker);
			});
		});
	};

	// Makes the trek's route and infos
	this.makeTrek = function (trek) {
		var marker = utils.getMarkerFromTrek(trek);
		var route = L.geoJson();

		route.addData(trek.geometry);
		self.trekLayers[trek.id] = new L.featureGroup();
		self.trekLayers[trek.id].addLayer(route);
		self.trekLayers[trek.id].addLayer(marker);
	};

	this.addTrekTileLayer = function (trekId) {
		console.log('Adding new tilelayer');
		if (angular.isUndefined(self.tileLayers[trekId])) {
			console.log('tilelayer created');
			self.tileLayers[trekId] = L.tileLayer(settings.tilesDir + '/' + trekId + '/{z}/{x}/{y}.png');
		}
		if (!self.map.hasLayer(self.tileLayers[trekId])) {
			console.log('tilelayer added on map');
			self.tileLayers[trekId].addTo(self.map);
		}
	};

	// Centers the map on the trek and zooms on it
	this.setDetailedSettings = function (trek) {
		var coord = utils.getStartPoint(trek);
		var mapContainer = document.getElementById('map').innerHTML;
		var bounds = [ [coord.lat - 0.05, coord.lng - 0.05] , [coord.lat + 0.05, coord.lng + 0.05] ]; 

		if (mapContainer === '') {
			self.makeMap(constants.leaflet.detailed, [coord.lat, coord.lng], bounds);
			self.trekLayers = {};
		}
		else {
			self.map.setZoomAround([coord.lat, coord.lng], constants.leaflet.detailed.DEFAULT_ZOOM);
			self.map.options.minZoom = constants.leaflet.detailed.DEFAULT_MIN_ZOOM;
			self.map.options.maxZoom = constants.leaflet.detailed.DEFAULT_MAX_ZOOM;
			self.map.setMaxBounds(bounds);
		}
		if (settings.isDevice && !settings.isConnected) {
			self.addTrekTileLayer(trek.id);
		}
		self.clearMapLayers();
		if (!self.trekLayers[trek.id]) {
			self.makeTrek(trek);
			self.makePois(trek);
		}
		self.map.addLayer(self.trekLayers[trek.id]);
	};

	// Centers on the given POI
	this.setPoiSettings = function (poi, trek) {
		var coord = utils.getStartPoint(poi);
		var mapContainer = document.getElementById('map').innerHTML;

		self.makeMap(constants.leaflet.detailed, [coord.lat, coord.lng]);
		self.trekLayers = {};
		self.makeTrek(trek);
		self.map.addLayer(self.trekLayers[trek.id]);
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
			iconSize: [32, 32],
			labelAnchor: [16, 16]
		}),
		trek_icon: L.divIcon({
			iconSize: [40, 40],
			iconAnchor: [20, 20],
			className: 'trek-icon',
			labelAnchor: [20, 0]
		})
	};

	this.getPoiIcon = function(poi) {
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
'use strict';

function leafletService($state, $cordovaGeolocation, constants, settings, utils, FiltersFactory, IconsService, TreksService, PoisService) {

	var userLocationMarker = null;
	var watchPosition;
	var self = this;

	self.trekLayers = {};
	self.bounds = {};
	self.tileLayers = {};

	this.makeMap = function (defaultMapSettings, coord) {
		var center = coord ? coord : [defaultMapSettings.LATITUDE, defaultMapSettings.LONGITUDE];

		self.map = L.map('map', {
			center: center,
			zoom: defaultMapSettings.DEFAULT_ZOOM,
			minZoom: defaultMapSettings.DEFAULT_MIN_ZOOM,
			maxZoom: defaultMapSettings.DEFAULT_MAX_ZOOM,
			scrollWheelZoom: true,
			zoomControl: false,
			layers: L.tileLayer(settings.leafletBackgroundUrl)
		});
	};

	this.stopWatch = function () {
		if (angular.isDefined(watchPosition)) {
			watchPosition.clearWatch();
		}
	};

	this.centerOnUser = function () {
		$cordovaGeolocation.getCurrentPosition().then(function (location) {

			console.log('Centering');
			self.map.setView([location.coords.latitude, location.coords.longitude]);
			if (!self.map.hasLayer(userLocationMarker)) {
				if (userLocationMarker) {
					console.log('Marker created');
					userLocationMarker.setLatLng([location.coords.latitude, location.coords.longitude]);
					userLocationMarker.addTo(self.map);
				}
				else {
					console.log('Marker not created');
					userLocationMarker = L.marker([location.coords.latitude, location.coords.longitude], {
						icon: IconsService.getUserLocationIcon()
					});
					userLocationMarker.addTo(self.map);
				}
			}
		});
	};

	this.followUser = function () {
		var watchOptions = {
			frequency : 200,
			timeout : 3000,
			enableHighAccuracy: false
		};

		self.centerOnUser();
		watchPosition = $cordovaGeolocation.watchPosition(watchOptions).then(null, null, function (location) {
			userLocationMarker.setLatLng([location.coords.latitude, location.coords.longitude]);
			self.map.setView([location.coords.latitude, location.coords.longitude]);
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

	// Takes a marker coords, compares them to bounds et changes bounds if needed
	this.compareBounds = function(bounds, coords) {
		if (bounds.length === 0) {
			bounds = [[coords.lat, coords.lng], [coords.lat, coords.lng]];
		}
		else {
			bounds[0][0] = (coords.lat < bounds[0][0]) ? coords.lat : bounds[0][0];
			bounds[0][1] = (coords.lng < bounds[0][1]) ? coords.lng : bounds[0][1];
			bounds[1][0] = (coords.lat > bounds[1][0]) ? coords.lat : bounds[1][0];
			bounds[1][1] = (coords.lng > bounds[1][1]) ? coords.lng : bounds[1][1];
		}
		return (bounds);
	};

	// Enlarge the bounds by the given value
	this.enlargeBounds = function(bounds, value) {
		bounds[0][0] = bounds[0][0] - value;
		bounds[0][1] = bounds[0][1] - value;
		bounds[1][0] = bounds[1][0] + value;
		bounds[1][1] = bounds[1][1] + value;
		return (bounds);
	};

	// Sets markers on each trek's starting point, creates the global bounds
	this.makeTreksLayer = function () {
		var marker;

		self.bounds.global = [];
		self.trekLayers.global = new L.MarkerClusterGroup({
			iconCreateFunction: function(cluster) {
				return IconsService.getClusterIcon(cluster);
			}
		});
		FiltersFactory.getFilteredTreks().then(function (treks) {
			angular.forEach(treks, function (trek) {

				marker = utils.getMarkerFromTrek(trek);
				marker.on('click', function () {
					$state.go('root.map.detailed', { trekId: trek.id });
				});
				self.trekLayers['global'].addLayer(marker);

				self.bounds.global = self.compareBounds(self.bounds.global, marker._latlng);
			});
			self.bounds.global = self.enlargeBounds(self.bounds.global, 0.1);
			self.map.setMaxBounds(self.bounds.global);
		});
	};

	// Sets the defaut position and zoom level when the view is global
	this.setGlobalSettings = function () {
		var mapContainer = document.getElementById('map').innerHTML;
		var coord = { lat: constants.leaflet.global.LATITUDE, lng: constants.leaflet.global.LONGITUDE };

		if (mapContainer === '') {
			self.makeMap(constants.leaflet.global, coord);
			self.trekLayers = {};
		}
		else {
			self.map.options.minZoom = constants.leaflet.global.DEFAULT_MIN_ZOOM;
			self.map.options.maxZoom = constants.leaflet.global.DEFAULT_MAX_ZOOM;
			self.map.setZoom(constants.leaflet.global.DEFAULT_ZOOM);
		}
		self.clearMapLayers();
		if (!self.trekLayers['global']) {
			self.makeTreksLayer();
		}
		if (self.bounds.global.length !== 0) {
			self.map.setMaxBounds(self.bounds.global);
		}
		self.map.addLayer(self.trekLayers['global']);
	};

	// Makes the POI markers
	this.makePois = function (trek) {
		var marker;
		var poisLayer;

		poisLayer = new L.MarkerClusterGroup({
			iconCreateFunction: function(cluster) {
				return IconsService.getClusterIcon(cluster);
			}
		});
		PoisService.getTrekPois(trek.id).then(function (pois) {
			angular.forEach(pois, function (poi) {
				marker = utils.getMarkerFromPoi(poi);
				marker.on('click', function () {
					$state.go('root.poi', { poiId: poi.id, trekId : trek.id, view: 'map' });
				});
				poisLayer.addLayer(marker);
			});
			self.trekLayers[trek.id].addLayer(poisLayer);
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

		if (angular.isUndefined(self.bounds[trek.id])) {
			self.bounds[trek.id] = [];
			angular.forEach(trek.geometry.coordinates, function (coords) {
				self.bounds[trek.id] = self.compareBounds(self.bounds[trek.id], { lat : coords[1], lng : coords[0] });
			});
			self.bounds[trek.id] = self.enlargeBounds(self.bounds[trek.id], 0.05);
		}
	};

	this.addTrekTileLayer = function (trekId) {
		if (angular.isUndefined(self.tileLayers[trekId])) {
			self.tileLayers[trekId] = L.tileLayer(settings.tilesDir + '/' + trekId + '/{z}/{x}/{y}.png');
		}
		if (!self.map.hasLayer(self.tileLayers[trekId])) {
			self.tileLayers[trekId].addTo(self.map);
		}
	};

	// Centers the map on the trek and zooms on it
	this.setDetailedSettings = function (trek) {
		var coord = utils.getStartPoint(trek);
		var mapContainer = document.getElementById('map').innerHTML;

		if (mapContainer === '') {
			self.makeMap(constants.leaflet.detailed, [coord.lat, coord.lng]);
			self.trekLayers = {};
		}
		else {
			self.map.setZoomAround([coord.lat, coord.lng], constants.leaflet.detailed.DEFAULT_ZOOM);
			self.map.options.minZoom = constants.leaflet.detailed.DEFAULT_MIN_ZOOM;
			self.map.options.maxZoom = constants.leaflet.detailed.DEFAULT_MAX_ZOOM;
		}
		if (settings.isDevice && !settings.isConnected) {
			self.addTrekTileLayer(trek.id);
		}
		self.clearMapLayers();
		if (!self.trekLayers[trek.id]) {
			self.makeTrek(trek);
			self.makePois(trek);
		}
		self.map.setMaxBounds(self.bounds[trek.id]);
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
		user_location_icon: L.icon({
			iconUrl: 'img/map/user_position.png',
			iconSize: [5, 5],
			iconAnchor: [2, 2],
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

	this.getUserLocationIcon = function() {
		return trek_icons.user_location_icon;
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
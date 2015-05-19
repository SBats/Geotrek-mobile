'use strict';

function favoritesService($q, TreksService) {

	var self = this;

	self.favoritesId = JSON.parse(window.localStorage['favorites'] || '[]');

	this.isFavorite = function (id) {
		return (self.favoritesId.indexOf(id) > -1);
	};

	this.loadFavorites = function () {
		var deferred = $q.defer();

		self.favorites = [];
		TreksService.getTreks().then(function (treks) {+
			angular.forEach(treks.features, function (trek) {
				if (self.favoritesId.indexOf(String(trek.id)) > -1) {
					self.favorites.push(trek);
				}
			});
			deferred.resolve(self.favorites);
		});
		return (deferred.promise);
	};

	this.getFavorites = function () {
		var deferred = $q.defer();

		if (self.favorites) {
			deferred.resolve(self.favorites);
		}

		return (self.loadFavorites());
	};

	this.addToFavorites = function (id) {
		self.favoritesId.push(id);
		window.localStorage['favorites'] = JSON.stringify(self.favoritesId);
		self.loadFavorites();
	};

	this.removeFavorite = function (id) {
		self.favoritesId.splice(self.favoritesId.indexOf(id), 1);
		window.localStorage['favorites'] = JSON.stringify(self.favoritesId);
		self.loadFavorites();
	};

	// Adds or removes a favorite depending if it already is a favorite
	this.changeFavorites = function (id) {
		if (self.isFavorite(id)) {
			self.removeFavorite(id);
		}
		else {
			self.addToFavorites(id);
		}
	};
}

module.exports = {
	favoritesService: favoritesService
};
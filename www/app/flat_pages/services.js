'use strict';

function flatPagesServices($resource, $q, settings) {

	var flatPagesResource = $resource(settings.flatUrl, {}, {
		query: {
			method: 'GET',
			cache: true,
			isArray: true
		}
	});
	var self = this;

	this.getFlatPages = function() {
		var deferred = $q.defer();

		if (self.flatPages) {
			deferred.resolve(self.flatPages);
		}

		flatPagesResource.query().$promise.then(function (flatPages) {
			self.flatPages = flatPages;
			deferred.resolve(flatPages);
		});

		return (deferred.promise);
	};

	this.getFlatPage = function(flatId) {
		var deferred = $q.defer();

		self.getFlatPages().then(function (flatPages) {
			angular.forEach(flatPages, function (flatPage) {

				if (flatPage.id == flatId) {
					deferred.resolve(flatPage);
				}
			});
		});

		return (deferred.promise);
	};
}

module.exports = {
	flatPagesServices: flatPagesServices
};
'use strict';

function flatPagesController($scope, flatPages) {

	console.log(flatPages);
	$scope.flatPages = flatPages;
}

function flatPageController($scope, flatPage) {

	console.log(flatPage);
	$scope.flatPage = flatPage;
}

module.exports = {
	flatPagesController: flatPagesController,
	flatPageController: flatPageController
};
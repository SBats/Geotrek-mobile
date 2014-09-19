/**
 * Service that persists and retrieves static pages from data source
 */

geotrekStaticPages.service('staticPagesFileSystemService', [
    '$resource', '$rootScope', '$window', '$q', '$http', '$cordovaFile', '$log', 'settings', 'utils',
    function ($resource, $rootScope, $window, $q, $http, $cordovaFile, $log, settings, utils) {

    this.downloadStaticPages = function(url) {
        var _this = this;

        return utils.downloadFile(url, settings.device.CDV_STATIC_PAGES_ROOT_FILE)
        .then(function() {
            return _this.downloadStaticPagesPictures();
        }).catch(function(error){
            $log.error(error);
        });
    };

   this.replaceImgURLs = function(staticPagesData) {
        // Parse static page url on content, and change their URL
        angular.forEach(staticPagesData, function(pages) {

            // To change static content img urls, we are parsing given content

            // Wrapping it with div to be sure than root element is unique
            // (If page content has several root elements, like a <h1> followed by a <p>
            // for example, html() call will only return first element, and we need all elements)
            var wrappedContent = '<div>' + pages.content + '</div>';

            // Using jqlite to parse wrapped content
            var $htmlContent = angular.element(wrappedContent);

            // Then we look for each img markup, and change url with device one
            angular.forEach($htmlContent.find('img'), function(element) {
                var currentUrl = element.src;
                var filename = currentUrl.substr(currentUrl.lastIndexOf('/') + 1);

                element.src = settings.device.CDV_STATIC_PAGES_IMG_ROOT + '/' + filename;
            });

            // And finally, we affect this transformed content to initial one
            pages.content = $htmlContent.html();
        });

        return staticPagesData;
    };    

    this.downloadStaticPagesPictures = function() {
        var _this = this;

        return this.getRawStaticPages()
        .then(function(staticPages) {
            var promises = [];

            angular.forEach(staticPages, function(page) {

                angular.forEach(page.media, function(media) {
                    var mediaUrl = media.url;
                    var serverUrl = settings.DOMAIN_NAME + mediaUrl;
                    var filename = mediaUrl.substr(mediaUrl.lastIndexOf('/') + 1);

                    promises.push(utils.downloadFile(serverUrl, settings.device.CDV_STATIC_PAGES_IMG_ROOT + '/' + filename));
                });
            })

            return $q.all(promises);
        });
    };    

    // Getting treks used for mobile purpose
    // Image urls are converted to cdv://localhost/persistent/... ones
    this.getStaticPages = function() {
        var replaceUrls = true,
            deferred = $q.defer();

        this._getStaticPages(replaceUrls)
        .then(function(jsonData) {
            var staticPages = [];
            angular.forEach(jsonData, function(page) {

                staticPages.push({
                    text: page.title,
                    title: page.title,
                    description: page.content
                });
            })

            deferred.resolve(staticPages);
        }, function(error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    // Getting server trek original data
    this.getRawStaticPages = function() {
        var replaceUrls = false;
        return this._getStaticPages(replaceUrls);
    };

    this._getStaticPages = function(replaceUrls) {
        var filePath = settings.device.RELATIVE_STATIC_PAGES_ROOT_FILE,
            deferred = $q.defer(),
            _this = this;

        $cordovaFile.readAsText(filePath)
        .then(
            function(data) {
                var jsonData = JSON.parse(data);
                if (replaceUrls) {
                    jsonData = _this.replaceImgURLs(jsonData);
                }
                deferred.resolve(jsonData);
            },
            deferred.reject
        );

        return deferred.promise;
    };    

}]);
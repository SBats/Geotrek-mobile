/**
 * Service that persists and retrieves static pages from data source
 */

geotrekStaticPages.service('staticPagesFileSystemService', [
    '$resource', '$rootScope', '$window', '$q', '$http', '$cordovaFile', 'logging', 'settings', 'globalSettings', 'utils', 'globalizationSettings',
    function ($resource, $rootScope, $window, $q, $http, $cordovaFile, logging, settings, globalSettings, utils, globalizationSettings) {

    var _staticPages;

    this.downloadStaticPages = function(url) {
        var _this = this;
        return globalizationSettings.getCurrentLang()
            .then(
                function (currentLang) {
                    var fileUrl = settings.device.CDV_STATIC_PAGES_ROOT_FILE.replace(/\$lang/, currentLang);
                    return utils.downloadFile(url, fileUrl)
                    .then(function() {
                        return _this.downloadStaticPagesPictures();
                    }).catch(function(error){
                        logging.error(error);
                    });
                }
            );
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
                if (!utils.isAbsoluteURL(currentUrl)) {
                    var filename = currentUrl.substr(currentUrl.indexOf('media'));
                    element.src = globalSettings.DOMAIN_NAME + '/' + filename;
                }
            });



            // And finally, we affect this transformed content to initial one
            pages.content = $htmlContent.html();
        });

        return staticPagesData;
    };   

    // Getting treks used for mobile purpose
    // Image urls are converted to cdv://localhost/persistent/... ones
    this.getStaticPages = function() {
        var replaceUrls = true,
            deferred = $q.defer();

        if(!_staticPages) {
            this._getStaticPages(replaceUrls)
            .then(function(jsonData) {
                var staticPages = [];
                angular.forEach(jsonData, function(page) {
                    if ((page.target === 'all' || page.target === 'mobile') && page.published) {
                        staticPages.push({
                            text: page.title,
                            title: page.title,
                            description: page.content
                        });
                    }
                });
                _staticPages = staticPages;
                deferred.resolve(_staticPages);
            }, function(error) {
                deferred.reject(error);
            });
        } else {
            deferred.resolve(_staticPages);
        }

        return deferred.promise;
    };

    // Getting server trek original data
    this.getRawStaticPages = function() {
        var replaceUrls = false;
        return this._getStaticPages(replaceUrls);
    };

    this._getStaticPages = function(replaceUrls) {
        var deferred = $q.defer(),
            _this = this;

        globalizationSettings.getCurrentLang()
            .then(
                function (currentLang) {
                    var filePath = settings.device.RELATIVE_STATIC_PAGES_ROOT_FILE.replace(/\$lang/, currentLang);
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
                }
            );

        return deferred.promise;
    };    

}]);

/**
 * Service that persists and retrieves treks from data source
 */

geotrekStaticPages.service('staticPagesRemoteService', [
    '$q',
    function ($q) {

    this.getStaticPages = function() {
        var deferred = $q.defer();
        var staticPages = [
            {
                text: "Title 1",
                title: "Title 1",
                description: "Lorem ipsum <a href='http://makina-corpus.com' class='external-link'>Makina Corpus</a>"
            }, {
                text: "Title 2",
                title: "Title 2",
                description: "Lorem ipsum"
            }
        ];
        deferred.resolve(staticPages);
        return deferred.promise;
    };

}]);

collettaApp.factory('filesUpload', ['$resource', '$routeParams', 'ServerAddress', function($resource, $routeParams, ServerAddress){
    var filesUploadCRUD = $resource(ServerAddress.getServerAddress()+'/:token/files/:year', {
    	token: $routeParams.token,
    	year: '@year'
    });
    return filesUploadCRUD;
}]);
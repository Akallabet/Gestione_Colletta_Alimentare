collettaApp.factory('GetInfoFactory', ['$resource', 'ServerAddress', function($resource, ServerAddress){
    var GetInfoFactory = $resource(ServerAddress.getServerAddress()+':token/get/:property/:limit_start/:limit_end',
        {
            token: '@token',
            property: '@property',
            limit_start: '@limit_start',
            limit_end: '@limit_end'
        }
    );
    return GetInfoFactory;
}]);
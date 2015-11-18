collettaApp.factory('LogoutFactory', ['$resource', 'ServerAddress', function($resource, ServerAddress){
    var LogoutFactory = $resource(ServerAddress.getServerAddress()+'logout', {});
    return LogoutFactory;
}]);
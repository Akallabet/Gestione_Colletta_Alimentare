collettaApp.factory('LoginFactory', ['$resource', 'ServerAddress', function($resource, ServerAddress){
    var LoginFactory = $resource(ServerAddress.getServerAddress()+'login', {});
    return LoginFactory;
}]);

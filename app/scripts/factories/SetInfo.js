collettaApp.factory('SetInfoFactory', ['$resource', 'ServerAddress', function($resource, ServerAddress){
    var SetInfoFactory = $resource(ServerAddress.getServerAddress()+':token/set/:property',{
        token: '@token',
        property: '@property'
    });
    return SetInfoFactory;
}]);
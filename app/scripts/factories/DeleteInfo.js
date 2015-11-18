collettaApp.factory('DeleteInfoFactory', ['$resource', 'ServerAddress', function($resource, ServerAddress){
    var DeleteInfoFactory = $resource(ServerAddress.getServerAddress()+':token/delete/:property',{
        token: '@token',
        property: '@property'
    });
    return DeleteInfoFactory;
}]);
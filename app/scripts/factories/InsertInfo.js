collettaApp.factory('InsertInfoFactory', ['$resource', 'ServerAddress', function($resource, ServerAddress){
    var InsertInfoFactory = $resource(ServerAddress.getServerAddress()+':token/save/:property',{
        token: '@token',
        property: '@property'
    });
    return InsertInfoFactory;
}]);
collettaApp.factory('UserInfoFactory', ['$resource', 'ServerAddress', function($resource, ServerAddress){
    var UserInfoFactory = $resource(ServerAddress.getServerAddress()+':token/get/user', {token: '@token'});
    return UserInfoFactory;
}]);
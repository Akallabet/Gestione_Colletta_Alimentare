collettaApp.service('LogoutService', ['$q', '$resource', '$routeParams', 'ServerAddress', function($q, $resource, $routeParams, ServerAddress)
{
    var def= $q.defer();
    return{
        def: def,
        prom: def.promise,
        logout: function(){
            var $this= this;
            var call = $resource(ServerAddress.getServerAddress()+'/logout', {token: $routeParams.token});
            call.get(function(){
                $this.def.resolve();
                // call.resolve();
            }, function(){
                $this.def.reject();
                // call.reject();
            });
        }
    }
}]);

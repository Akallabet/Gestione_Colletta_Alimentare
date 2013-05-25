'use strict';
var collettaApp= angular.module('collettaApp', ['ngResource','ui.bootstrap']);

collettaApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: LoginCtrl,
            templateUrl:'views/intro.html'
        })
        .when('/supermercati/:token', {
            templateUrl:'views/supermercati.html'
        })
        .when('/utenti/:token', {
            templateUrl:'views/utenti.html'
        })
        .when('/magazzini/:token', {
            templateUrl:'views/magazzini.html'
        })
        .when('/prodotti/:token/:idSupermercato', {
            templateUrl:'views/prodotti.html'
        })
        .otherwise({redirectTo:'/'});
});

                                        /*START SERVICES*/
collettaApp.service('ServerAddress', function()
{
    var s= '../api/V_1.0/index.php';
    return{
        getServerAddress: function(){return s;}
    }
});

collettaApp.service('UserInfoService', function()
{
    var info= '';
    return{
        getInfo: function(){return info;},
        addInfo: function(i){info= i;}
    }
});

collettaApp.service('ComuniMapper', function()
{
    var comuni= '';
    return{
        getComuni: function(){return comuni;},
        addComuni: function(c){comuni= c;}
    }
});
                                        /*END SERVICES*/
                                       
                                       /*START FACTORIES*/
collettaApp.factory('LoginFactory', ['$resource', 'ServerAddress', function($resource, ServerAddress){
    var LoginFactory = $resource(ServerAddress.getServerAddress()+'/login/:username/:password', {username: '@username', password: '@password'});
    return LoginFactory;
}]);

collettaApp.factory('LogoutFactory', ['$resource', 'ServerAddress', function($resource, ServerAddress){
    var LogoutFactory = $resource(ServerAddress.getServerAddress()+'/logout', {});
    return LogoutFactory;
}]);

collettaApp.factory('UserInfoFactory', ['$resource', 'ServerAddress', function($resource, ServerAddress){
    var UserInfoFactory = $resource(ServerAddress.getServerAddress()+'/:token/get/user', {token: '@token'});
    return UserInfoFactory;
}]);

collettaApp.factory('GetInfoFactory', ['$resource', 'ServerAddress', function($resource, ServerAddress){
    var GetInfoFactory = $resource(ServerAddress.getServerAddress()+'/:token/get/:property/:method/:par/:limit_start/:limit_end',
        {
            token: '@token',
            property: '@property',
            method: '@method',
            par: '@par',
            limit_start: '@limit_start',
            limit_end: '@limit_end'
        }
    );
    return GetInfoFactory;
}]);

collettaApp.factory('ProductsFactory', ['$resource', 'ServerAddress', function($resource, ServerAddress){
    var ProductsFactory = $resource(ServerAddress.getServerAddress()+'/save/prodotti',{});
    return ProductsFactory;
}]);

                                       /*END FACTORIES*/
                                      
                                        /*START COMMON FUNCTIONS*/
function getComuneById(comuni, id_comune)
{
    var ret= null;
    for(var i in comuni)
    {
        if(comuni[i].id==id_comune)
        {
            ret= angular.extend({}, comuni[i]);
            break;
        }
    }
    return ret;
}


                                        /*END COMMON FUNCTIONS*/

'use strict';
var collettaApp= angular.module('collettaApp', ['ngResource','ngRoute','ui.bootstrap','ui.select2']);

collettaApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: LoginCtrl,
            templateUrl:'views/login.html'
        })
        .when('/:token/home', {
            controller: LoginCtrl,
            templateUrl:'views/home.html'
        })
        .when('/:token/gestione/supermercati', {
            templateUrl:'views/admin/supermercati.html'
        })
        .when('/:token/gestione/utenti', {
            templateUrl:'views/admin/utenti.html'
        })
        .when('/:token/gestione/magazzini', {
            templateUrl:'views/admin/magazzini.html'
        })
        .when('/:token/supermercati', {
            templateUrl:'views/user/supermercati.html'
        })
        .when('/:token/prodotti/:idSupermercato', {
            templateUrl:'views/user/prodotti.html'
        })
        .otherwise({redirectTo:'/'});
});

                                        /*START SERVICES*/
collettaApp.service('ServerAddress', function()
{
    var s= '../api/index.php';
    return{
        getServerAddress: function(){return s;}
    }
});

collettaApp.service('AdminPagesService', function()
{
    return{
        sections: [],
        section: ''
    }
});

collettaApp.service('UserInfoService', ['$q',function($q)
{
    function User(obj){
        return $.extend({}, {
            nome: null,
            cognome: null,
            email: null,
            privilegi: null,
            ruolo: null,
            telefono: null,
            username: null,
            pages: [],
        }, obj);
    }

    return{
        user: {
            nome: null,
            cognome: null,
            email: null,
            privilegi: null,
            ruolo: null,
            telefono: null,
            username: null,
            pages: [],
        },
        userObj: function(obj){
            return new User(obj);
        }
    }
}]);

collettaApp.service('ComuniService', function()
{
    return{
        comuni: []
    }
});

collettaApp.service('CateneService', function()
{
    return{
        catene: []
    }
});

collettaApp.service('CapiEquipeService', function()
{
    return{
        capi_equipe: []
    }
});

collettaApp.service('SupermercatiService', ['$q', function($q){
    function Supermercato(obj){
        return $.extend({}, {
            index: null,
            selected: false,
            id: null,
            id_supermercato: null,
            id_colletta: null,
            colletta:null,
            id_catena: null,
            catena: null,
            nome: null,
            id_magazzino: null,
            id_area: null,
            id_comune: null,
            provincia: null,
            comune: null,
            confemrato: null,
            confermato: null,
            indirizzo: null,
            id_diocesi: null,
            capi_equipe: []
        }, obj);
    }

    return{
        supermercato: function(obj){
            return new Supermercato(obj);
        },
        supermercati: []
    }
}]);

                                        /*END SERVICES*/
                                       
                                       /*START FACTORIES*/
collettaApp.factory('LoginFactory', ['$resource', 'ServerAddress', function($resource, ServerAddress){
    var LoginFactory = $resource(ServerAddress.getServerAddress()+'/login', {});
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
    var GetInfoFactory = $resource(ServerAddress.getServerAddress()+'/:token/get/:property/:limit_start/:limit_end',
        {
            token: '@token',
            property: '@property',
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
                                       /*START DIRECTIVES*/


                                       /*END DIRECTIVES*/

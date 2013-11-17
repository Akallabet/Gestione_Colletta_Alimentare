'use strict';

collettaApp.controller('UserCtrl',['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'SetInfoFactory', 'UserInfoService', 'UserInfoFactory', 'LogoutFactory', 'VersionService', 'CollettaService',
function($scope, $resource, $location, $routeParams, GetInfoFactory, SetInfoFactory, UserInfoService, UserInfoFactory, LogoutFactory, VersionService, CollettaService)
{
    $scope.version= VersionService.version;
    $scope.activePage= $routeParams.page;
    $scope.token= $routeParams.token;
    $scope.user= UserInfoService.user;
    $scope.colletta= CollettaService.colletta;
    $scope.colletta_active= CollettaService.active;
    $scope.collettaPromise= CollettaService.collettaPromise;
    $scope.collettaDeferred= CollettaService.collettaDeferred;
    $scope.files= CollettaService.files;
    
    $scope.logout= function()
    {
        LogoutFactory.get(function()
        {
            $location.path('/');
        });
    }
    
    var collettaFactory= new GetInfoFactory();
    collettaFactory.$save({
        token: $routeParams.token,
        property: 'colletta'
    },function()
    {
        $scope.colletta.length=0;
        for(var i=0; i<collettaFactory.colletta.length; i++)
        {
            $scope.colletta.push($.extend(
                collettaFactory.colletta[i],
                {
                    attiva: (collettaFactory.colletta[i].attiva==1) ? true : false
                }
            ));
        }
        for(var i=0; i<$scope.colletta.length; i++)
        {
            if($scope.colletta[i].attiva)
            {
                CollettaService.active= $.extend({}, $scope.colletta[i]);
            }
        }
        $scope.collettaDeferred.resolve();
    });

    var usr= UserInfoFactory.get({token: $scope.token}, function(){
        if(usr.error)
        {
            $location.path('/');
        }
        else
        {
            angular.extend($scope.user, usr.user);
            
            switch(parseInt($scope.user.privilegi))
            {
                case 1:
                $scope.user.pages=[
                    //{url: 'gestione_catene', label: 'Catene'},
                    {url: 'gestione_supermercati', label: 'Supermercati'},
                    //{url: 'gestione_magazzini', label: 'Magazzini'},
                    //{url: 'gestione_utenti', label: 'Utenti'},
                    {url: 'supermercati', label: 'Carichi'},
                    {url: 'gestione_files', label: 'Upload'}
                ];
                break;
                default:
                    $scope.user.pages=[{url: 'supermercati', label: 'Gestione carichi'}];
                break;
            }
            /*
            usr.user.privilegi= parseInt(usr.user.privilegi);
            $scope.nome= usr.user.nome;
            $scope.cognome= usr.user.cognome;
            $scope.email= usr.user.email;
            $scope.privilegi= usr.user.privilegi;
            $scope.ruolo= usr.user.ruolo;
            $scope.telefono= usr.user.telefono;
            $scope.username= usr.user.username;
            
            switch($scope.privilegi)
            {
                case 1:
                $scope.pages=[
                    {url: 'gestione/supermercati', label: 'Gestione supermercati'},
                    {url: 'supermercati', label: 'Gestione carichi'},
                    {url: 'magazzini', label: 'gestione magazzini'},
                    {url: 'utenti', label: 'gestione utenti'}
                ];
                break;
                default:
                    $scope.pages=[{url: 'supermercati', label: 'Gestione carichi'}];
                break;
            }
            UserInfoService.addInfo(usr.user);*/
        }
    });
}]);
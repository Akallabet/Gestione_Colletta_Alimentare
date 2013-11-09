'use strict';

var UserCtrl=['$scope', '$resource', '$location', '$routeParams', 'UserInfoService', 'UserInfoFactory', 'LogoutFactory', 'VersionService',
function($scope, $resource, $location, $routeParams, UserInfoService, UserInfoFactory, LogoutFactory, VersionService)
{
    $scope.version= VersionService.version;
    $scope.activePage= $routeParams.page;
    $scope.token= $routeParams.token;
    $scope.user= UserInfoService.user;
    
    $scope.logout= function()
    {
        LogoutFactory.get(function()
        {
            $location.path('/');
        });
    }
    
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
                    {url: 'gestione/supermercati', label: 'Gestione'},
                    {url: 'supermercati', label: 'Carichi'}
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
}]
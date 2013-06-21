'use strict';

var UserCtrl=['$scope', '$resource', '$location', '$routeParams', 'UserInfoService', 'UserInfoFactory', 'LogoutFactory',
function($scope, $resource, $location, $routeParams, UserInfoService, UserInfoFactory, LogoutFactory)
{
    $scope.activePage= $routeParams.page;
    $scope.token= $routeParams.token;
    $scope.nome= null;
    $scope.cognome= null;
    $scope.email= null;
    $scope.privilegi= null;
    $scope.ruolo= null;
    $scope.telefono= null;
    $scope.username= null;
    $scope.pages= [];
    
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
            $scope.nome= usr.user.nome;
            $scope.cognome= usr.user.cognome;
            $scope.email= usr.user.email;
            $scope.privilegi= parseInt(usr.user.privilegi);
            $scope.ruolo= usr.user.ruolo;
            $scope.telefono= usr.user.telefono;
            $scope.username= usr.user.username;
            
            switch($scope.privilegi)
            {
                case 1:
                    $scope.pages=['supermercati','magazzini','utenti'];
                    break;
                case 4:
                    $scope.pages=['supermercati'];
                    break;
            }
            UserInfoService.addInfo(usr.user);
        }
    });
}]
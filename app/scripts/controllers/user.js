'use strict';

collettaApp.controller('UserCtrl',['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'SetInfoFactory', 'UserInfoService', 'UserInfoFactory', 'LogoutFactory', 'VersionService', 'CollettaService', 'LogoutService',
function($scope, $resource, $location, $routeParams, GetInfoFactory, SetInfoFactory, UserInfoService, UserInfoFactory, LogoutFactory, VersionService, CollettaService, LogoutService)
{
    $scope.version= VersionService.version;
    $scope.activePage= $routeParams.page;
    $scope.token= $routeParams.token;
    $scope.user= UserInfoService.info;
    $scope.colletta= CollettaService.colletta;
    $scope.colletta_active= CollettaService.active;
    $scope.files= CollettaService.files;    

    $scope.logout= function()
    {
        LogoutService.logout();
    }

    LogoutService.prom.then(function(){
        window.location.reload();
    }, function(){

    });

    UserInfoService.getInfo();
    CollettaService.getInfo();
}]);
'use strict';

collettaApp.controller('UserCtrl',['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'SetInfoFactory', 'UserInfoService', 'UserInfoFactory', 'LogoutFactory', 'VersionService', 'CollettaService',
function($scope, $resource, $location, $routeParams, GetInfoFactory, SetInfoFactory, UserInfoService, UserInfoFactory, LogoutFactory, VersionService, CollettaService)
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
        LogoutFactory.get(function()
        {
            $location.path('/');
        });
    }

    UserInfoService.getInfo();
    CollettaService.getInfo();
}]);

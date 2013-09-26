'use strict';

var HomeCtrl=['$scope', '$resource', '$location', '$routeParams', 'UserInfoService',
function($scope, $resource, $location, $routeParams, UserInfoService)
{
    $scope.token= $routeParams.token;
    $scope.user= UserInfoService.user;
}];
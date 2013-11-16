'use strict';

collettaApp.controller('AdminCtrl', ['$scope', '$resource', '$location', '$routeParams', 'UserInfoService', 'UserInfoFactory', 'AdminPagesService', 'LogoutFactory', 'VersionService',
function($scope, $resource, $location, $routeParams, UserInfoService, UserInfoFactory, AdminPagesService,  LogoutFactory, VersionService)
{
	$scope.version= VersionService.version;
	$scope.token= $routeParams.token;
    $scope.sections= AdminPagesService.sections;
    $scope.section= AdminPagesService.section;

    if($scope.sections.length==0)
    {
	    $scope.sections.push({url: 'supermercati', label: 'Supermercati', active: false});
	    $scope.sections.push({url: 'utenti', label: 'Utenti', active: false});
	    $scope.sections.push({url: 'magazzini', label: 'Magazzini', active: false});
	}
	$scope.sections.map(function(s){
			return s.active= (s.url==$scope.section) ? true: false;});
}])
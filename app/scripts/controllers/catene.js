'use strict';

var CateneCtrl=['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'CaricoService', 'VersionService',
function($scope, $resource, $location, $routeParams, GetInfoFactory, CaricoService, VersionService)
{
	$scope.version= VersionService.version;
}];
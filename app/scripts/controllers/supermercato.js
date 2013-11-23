'use strict';
var prodotti=[];

var SupermercatoCtrl= function($scope, $resource, $location, $routeParams, GetInfoFactory, SupermercatoService, $modalInstance, VersionService)
	{
		$scope.version= VersionService.version;
		
		$scope.modalTitle= SupermercatoService.modalTitle;
		
		$scope.ok = function () {
			$modalInstance.close('ok');
		}

		$scope.delete = function () {
	  		$modalInstance.close('del');
		}

		$scope.cancel = function () {
	  		$modalInstance.dismiss('cancel');
		}
	}


SupermercatoCtrl.$inject= ['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'SupermercatoService', '$modalInstance', 'VersionService'];
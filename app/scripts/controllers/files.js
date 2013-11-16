'use strict';

collettaApp.controller('FilesCtrl', ['$scope', '$resource', '$location', '$routeParams', 'UserInfoService', 'VersionService', 'filesUpload', 'CollettaService',
function($scope, $resource, $location, $routeParams, UserInfoService, VersionService, filesUpload, CollettaService)
{
	$scope.version= VersionService.version;
	$scope.token= $routeParams.token;
	$scope.colletta= CollettaService.colletta;
	$scope.colletta_active= CollettaService.active;
	$scope.files= CollettaService.files;
	$scope.progress= 0;
	$scope.collettaPromise= CollettaService.collettaPromise;

	$scope.collettaPromise.then(function(){
		$scope.colletta_active= $scope.colletta.filter(function(c){ return c.attiva=="1";})[0];
		var ret= filesUpload.get({year: $scope.colletta_active.anno}, function()
		{
			for (var i in ret.files[$scope.colletta_active.anno]) {
				$scope.files.push({name: i, checked: ret.files[$scope.colletta_active.anno][i].checked});
			};
		});
	});

	$scope.fileupload= function()
	{
		
	}
}]);
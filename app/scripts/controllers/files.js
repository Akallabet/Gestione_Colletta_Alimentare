'use strict';

collettaApp.controller('FilesCtrl', ['$scope', '$resource', '$q', '$location', '$routeParams', 'ServerAddress', 'SetInfoFactory', 'UserInfoService', 'VersionService', 'filesUpload', 'CollettaService', 'SupermercatiService', 'ComuniService', 'CateneService', 'AreeService', 'CapiEquipeService', 'CapiEquipeSupermercatiService', 'FeedbackService',
function($scope, $resource, $q, $location, $routeParams, ServerAddress, SetInfoFactory, UserInfoService, VersionService, filesUpload, CollettaService, SupermercatiService, ComuniService, CateneService, AreeService, CapiEquipeService, CapiEquipeSupermercatiService, FeedbackService)
{
	$scope.feedback= FeedbackService.feedback();
	$scope.version= VersionService.version;
	$scope.token= $routeParams.token;
	$scope.colletta= CollettaService.colletta;
	$scope.colletta_active= CollettaService.active;
	$scope.uploaded= 1;
	$scope.files= CollettaService.files;
	$scope.progress= 0;
	$scope.collettaPromise= CollettaService.collettaPromise;

	CollettaService.prom.then(function(){
		$scope.colletta_active= $scope.colletta.filter(function(c){ return c.attiva=="1";})[0];
		
		var ret= filesUpload.get({year: $scope.colletta_active.anno}, function()
		{
			$scope.files.length=0;
			for (var i in ret.files[$scope.colletta_active.anno]) {
				$scope.files.push({
					name: i,
					checked: ret.files[$scope.colletta_active.anno][i].checked,
					status : (ret.files[$scope.colletta_active.anno][i].checked) ? 1 : 0});
				if(!ret.files[$scope.colletta_active.anno][i].checked) $scope.uploaded= 0;
			};
		});
	});

	$scope.getChecked= function(file){
		var ret= true;
		for (var i=0; i<$scope.files.length; i++) {
			if($scope.files[i].status==0) ret= false;
		};
		return ret;
	}

	$scope.updateInfo= function()
	{
		var filesUploadCRUD = $resource(ServerAddress.getServerAddress()+'/:token/info/update/:year', {
	    	token: $routeParams.token,
	    	year: $scope.colletta_active.anno
	    });

	    var ret= filesUploadCRUD.get(function(){
	    	if(typeof ret.result!='undefined')
	    	{
	    		//console.log(ret)
	    	}
	    });
	}
	$scope.changeCollettaActive= function(c)
    {
        var values=[];
        var set=[];

        for(var i=0; i<$scope.colletta.length; i++)
        {
            $scope.colletta[i].attiva= ($scope.colletta[i].anno==c.anno) ? true : false;
            values.push($scope.colletta[i]);
            set.push({id: $scope.colletta[i].id});
        }

        var setC= new SetInfoFactory({
            values: values,
            set: set
        });
        setC.$save({
            token: $routeParams.token,
            property: 'colletta'
        },
        function(){
        	$q.all([ComuniService.getInfo(false),
        			CateneService.getInfo(false),
        			CapiEquipeService.getInfo(false),
        			AreeService.getInfo(false),
        			CapiEquipeSupermercatiService.getInfo(false)]).then(function(){
				SupermercatiService.getInfo(true);
			});
        });
    }

    $scope.deleteCache= function()
    {
    	$scope.feedback.changeStatus(1);
    	var setCache= $resource(ServerAddress.getServerAddress()+':token/cache/delete',{token: '@token'});
    	
    	var setC= new setCache();
        setC.$get({
            token: $routeParams.token
        },
        function(){
        	$scope.feedback.changeStatus(2);
   //      	$q.all([ComuniService.getInfo(false),
   //      			CateneService.getInfo(false),
   //      			CapiEquipeService.getInfo(false),
   //      			AreeService.getInfo(false),
   //      			CapiEquipeSupermercatiService.getInfo(false)]).then(function(){
			// 	SupermercatiService.getInfo(true);
			// });
        },function(){
        	$scope.feedback.changeStatus(3);
        });
    }
}]);
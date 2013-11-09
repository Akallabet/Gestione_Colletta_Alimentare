'use strict';

var LoginCtrl=['$scope', '$resource','$location','LoginFactory', 'VersionService',
function($scope, $resource, $location, LoginFactory, VersionService)
{
    $scope.version= VersionService.version;
    $scope.alerts= [];
    $scope.closeAlerts= function(){
        $scope.alerts= [];
    }
    $scope.username='';
    $scope.password='';
    
    $scope.login=function(){
        if($scope.username!=='' && $scope.password!=='')
        {
            var loginUser= new LoginFactory({username: $scope.username, password: $scope.password});
            loginUser.$save(function() {
                if(!arguments[0].error)
                {
                    $scope.alerts=[];
                    $location.path(arguments[0].token+'/home/');
                }
                else
                    $scope.alerts.push({type:"error",disabled: false, msg: 'Nome utente o password errati, riprova!'});
            });
        }
    }
}]
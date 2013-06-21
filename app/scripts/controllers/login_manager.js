'use strict';

var LoginCtrl=['$scope', '$resource','$location','LoginFactory',
function($scope, $resource, $location, LoginFactory)
{
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
                    $location.path('/supermercati/'+arguments[0].token);
                }
                else
                    $scope.alerts.push({type:"error",disabled: false, msg: 'Nome utente o password errati, riprova!'});
            });
        }
    }
}]
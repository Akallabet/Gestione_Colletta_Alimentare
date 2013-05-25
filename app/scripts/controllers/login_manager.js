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
            var user= LoginFactory.save({username: $scope.username, password: $scope.password}, function() {
                if(!user.error)
                {
                    $scope.alerts=[];
                    $location.path('/supermercati/'+user.token);
                }
                else
                    $scope.alerts.push({type:"error",disabled: false, msg: 'Nome utente o password errati, riprova!'});
            });
        }
    }
}]
'use strict';

var SupermercatiCtrl=['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory',
function($scope, $resource, $location, $routeParams, GetInfoFactory)
{
    $scope.supermercati= [];
    $scope.columns=[];
    $scope.getComuneById= getComuneById;
    
    $scope.rowsNumber= 15;
    $scope.currentPage=1;
    
    $scope.totalPages= function()
    {
        return Math.round($scope.supermercati.length/$scope.rowsNumber);
    }
    
    $scope.setPage= function(p)
    {
        $scope.currentPage=p;
    }
    
    var comuni= GetInfoFactory.get({
        token: $routeParams.token,
        property: 'comuni',
        method: 'all',
        limit_start: '',
        limit_end: ''
    },function()
    {
        if(typeof $routeParams.idSupermercato!='undefined') $scope.getSupermercatiById();
        else $scope.getAllSupermercati(); 
    });
    
    $scope.getAllSupermercati= function()
    {
        var superm= GetInfoFactory.get({
            token: $routeParams.token,
            property: 'supermercati',
            method: 'IdArea',
            par: '1',
            limit_start: '',
            limit_end: ''
        },
        function(){
            for(var i in superm.supermercati)
            {
                $scope.supermercati.push(angular.extend({index: i+1},superm.supermercati[i]));
            }
        });
    }
    
    $scope.getSupermercatiById= function()
    {
        var superm= GetInfoFactory.get({
            token: $routeParams.token,
            property: 'supermercati',
            method: 'Id',
            par: $routeParams.idSupermercato,
            limit_start: '0',
            limit_end: '1'
        },
        function(){
            for(var i in superm.supermercati)
            {
                $scope.supermercati.push(angular.extend({index: i+1},superm.supermercati[i]));
            }
        });
    }
    
    $scope.openDetails= function(id)
    {
        $location.path('/prodotti/'+$routeParams.token+'/'+id);
    }
}];

collettaApp.filter('range', function() {
  return function(input, min, max) {
    var ret=[];
    if(typeof input!='undefined')
    {
        min = parseInt(min);
        max = parseInt(max);
        for (var i=min; i<max; i++)
        {
            if(i<input.length) ret.push(input[i]);
        }
    }
    return ret;
  };
});
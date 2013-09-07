'use strict';

var SupermercatiCtrl=['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory',
function($scope, $resource, $location, $routeParams, GetInfoFactory)
{
    $scope.supermercati= [];
    $scope.pages= 1;
    $scope.columns=[];
    $scope.getComuneById= getComuneById;
    $scope.chosenSuperm= 2;
    
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
    
    var comuniService= GetInfoFactory.get({
        token: $routeParams.token,
        property: 'comuni',
        method: 'all',
        limit_start: '',
        limit_end: ''
    },function()
    {
        comuni= comuniService.comuni;
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
                $scope.supermercati.push(angular.extend({index: i+1, selected: false},superm.supermercati[i]));
            }
            $scope.chosenSuperm= $scope.supermercati[0].id;
            $scope.pages= $scope.totalPages();
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
    
    $scope.filterFirst= {
        initSelection : function (element, callback) {
            console.log(element);
          callback($(element).data('$ngModelController').$modelValue);
        }
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
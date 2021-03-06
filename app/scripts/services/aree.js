collettaApp.service('AreeService', ["$q", 'GetInfoFactory', '$routeParams', function($q, GetInfoFactory, $routeParams)
{
	var def= $q.defer();
    return{
    	def: def,
    	prom: def.promise,
        aree: [],
        getInfo: function(refresh)
        {
        	var $this= this;
        	if(refresh || $this.aree.length==0)
	        {
	            var areeFactory= new GetInfoFactory();
	            areeFactory.$save({
	                token: $routeParams.token,
	                property: 'aree'
	            },
	            function(result)
	            {
	                for (var i = 0; i < areeFactory.aree.length; i++) {
	                    $this.aree.push(areeFactory.aree[i]);
	                }
	                $this.def.resolve();
	            });
	        }
	        else
	            $this.def.resolve();
        }
    }
}]);
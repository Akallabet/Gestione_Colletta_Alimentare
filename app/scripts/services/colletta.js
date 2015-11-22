collettaApp.service('CollettaService', ["$q",'GetInfoFactory', '$routeParams', function($q, GetInfoFactory, $routeParams)
{
	var def= $q.defer();
    return{
    	def: def,
    	prom: def.promise,
        colletta: [],
        active: '',
        files: [],
        getInfo: function()
        {
        	var $this= this;
        	var collettaFactory= new GetInfoFactory();
		    var res= collettaFactory.$save({
		        token: $routeParams.token,
		        property: 'colletta'
		    },
		    function(result)
            {
		        $this.colletta.length=0;
		        for(var i=0; i<collettaFactory.colletta.length; i++)
		        {
		            $this.colletta.push($.extend(
		                collettaFactory.colletta[i],
		                {
		                    attiva: (collettaFactory.colletta[i].attiva==1) ? true : false
		                }
		            ));
		        }
		        for(var i=0; i<$this.colletta.length; i++)
		        {
		            if($this.colletta[i].attiva)
		            {
		                $this.active= $.extend({}, $this.colletta[i]);
		            }
		        }
		        $this.def.resolve();
		    });
		    return res;
        }
    }
}]);
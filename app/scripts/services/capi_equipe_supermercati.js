collettaApp.service('CapiEquipeSupermercatiService', ["$q", 'GetInfoFactory', 'InsertInfoFactory', 'SetInfoFactory','$routeParams', 'SupermercatoService', function($q, GetInfoFactory, InsertInfoFactory, SetInfoFactory, $routeParams, SupermercatoService)
{
	var def= $q.defer();
    return{
    	def: def,
    	prom: def.promise,
        capi_equipe_supermercati: [],
        getInfo: function(refresh)
        {
        	var res= null;
        	var $this= this;
        	if(refresh || $this.capi_equipe_supermercati.length=== 0)
        	{
	        	var capi_equipe_supermercatiFactory= new GetInfoFactory();

		        res= capi_equipe_supermercatiFactory.$save({
		            token: $routeParams.token,
		            property: 'capi_equipe_supermercati'
		        },
		        function(result)
	            {
		        	$this.capi_equipe_supermercati.length= 0;
		        	for (var i = 0; i < capi_equipe_supermercatiFactory.capi_equipe_supermercati.length; i++) {
		        		$this.capi_equipe_supermercati.push(capi_equipe_supermercatiFactory.capi_equipe_supermercati[i]);
		        	}
		            $this.def.resolve();
		        });
		        return res;
		    }
        },
        saveInfo: function()
	    {
	    	var $this= this;
	        var newCapoEquipeSupermercato= new InsertInfoFactory({
	            values: [{id_capo_equipe: SupermercatoService.info.capo_equipe.id, id_supermercato: SupermercatoService.info.id}]
	        });

	        var r= newCapoEquipeSupermercato.$save({
	            token: $routeParams.token,
	            property: 'capi_equipe_supermercati'
	        },
	        function(result)
	        {
	        	
	        });
	        return r;
	    },
	    setInfo: function()
	    {
	    	var $this= this;
	        var setSup= new SetInfoFactory({
	            values: [{id_capo_equipe: SupermercatoService.info.capo_equipe.id, id_supermercato: SupermercatoService.info.id}],
	            set: [{id_supermercato: SupermercatoService.info.id}]
	        });

	        var r= setSup.$save({
	            token: $routeParams.token,
	            property: 'capi_equipe_supermercati'
	        },
	        function(){
	        	// $this.def.notify(1);
	            // getSupermercati(true);
	        });
	        
	        return r;
	    }
    }
}]);
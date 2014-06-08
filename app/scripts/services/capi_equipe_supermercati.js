collettaApp.service('CapiEquipeSupermercatiService', ["$q", 'GetInfoFactory', '$routeParams', function($q, GetInfoFactory, $routeParams)
{
	var def= $q.defer();
    return{
    	def: def,
    	prom: def.promise,
        capi_equipe_supermercati: [],
        getInfo: function()
        {
        	var $this= this;
        	var capi_equipe_supermercatiFactory= new GetInfoFactory();

	        capi_equipe_supermercatiFactory.$save({
	            token: $routeParams.token,
	            property: 'capi_equipe_supermercati'
	        },function()
	        {
	        	$this.capi_equipe_supermercati.length= 0;
	        	for (var i = 0; i < capi_equipe_supermercatiFactory.capi_equipe_supermercati.length; i++) {
	        		$this.capi_equipe_supermercati.push(capi_equipe_supermercatiFactory.capi_equipe_supermercati[i]);
	        	}
	            $this.def.resolve();
	        });
        }
    }
}]);
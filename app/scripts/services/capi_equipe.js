collettaApp.service('CapiEquipeService', ["$q", 'GetInfoFactory', '$routeParams', function($q, GetInfoFactory, $routeParams)
{
	var def= $q.defer();
    return{
    	def: def,
    	prom: def.promise,
        capi_equipe: {},
        capi_equipe_array: [],
        getInfo: function()
        {
        	var $this= this;
        	if($this.capi_equipe_array.length==0)
	        {
	            var capi_equipeFactory= new GetInfoFactory();

	            capi_equipeFactory.$save({
	                token: $routeParams.token,
	                property: 'capi_equipe'
	            },function()
	            {
	                for (var i = 0; i < capi_equipeFactory.capi_equipe.length; i++) {
	                    $this.capi_equipe[capi_equipeFactory.capi_equipe[i].id]= $.extend({supermercati: []},capi_equipeFactory.capi_equipe[i]);
	                    $this.capi_equipe_array.push($this.capi_equipe[capi_equipeFactory.capi_equipe[i].id]);
	                }
	                $this.def.resolve();
	            });
	        }
	        else
	            $this.def.resolve();
        }
    }
}]);
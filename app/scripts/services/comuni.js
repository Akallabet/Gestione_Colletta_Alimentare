collettaApp.service('ComuniService', ["$q", 'GetInfoFactory', 'ProvincieService', '$routeParams', function($q, GetInfoFactory, ProvincieService, $routeParams)
{
	var def= $q.defer();
    return{
    	def: def,
    	prom: def.promise,
        comuni: [],
        getInfo: function(refresh)
        {
        	var $this= this;
        	if(refresh || $this.comuni.length==0)
	        {
	            var comuniFactory= new GetInfoFactory();

	            comuniFactory.$save({
	                token: $routeParams.token,
	                property: 'comuni'
	            },
	            function(result)
	            {
	                for (var i = 0; i < comuniFactory.comuni.length; i++) {
	                    $this.comuni.push(comuniFactory.comuni[i]);
	                }
	                var provincieTmp= _.uniq($this.comuni.map(function(c){ return {id: c.id_provincia, nome: c.provincia}}), 'id');
	                ProvincieService.provincie.length=0;
	                for (var i = 0; i < provincieTmp.length; i++) {
	                    ProvincieService.provincie[i]= $.extend({}, provincieTmp[i]);
	                };
	                $this.def.resolve();
	            });
	        }
	        else
	            $this.def.resolve();
        }
    }
}]);
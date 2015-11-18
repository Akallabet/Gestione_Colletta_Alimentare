collettaApp.service('ReportService', ["$q", 'GetInfoFactory', '$routeParams', 'CaricoService', function($q, GetInfoFactory, $routeParams, CaricoService)
{
	var def= $q.defer();
    return{
    	def: def,
    	prom: def.promise,
        report: [],
        reportByComuni: {},
        reportByComuniArray: [],
        totaliComplessivi: {tipiArray: [], tipi: $.extend(true, [], CaricoService.prodottiTmpl), complessivo: {kg: 0, scatole: 0, carichi: 0}},
        getInfo: function(refresh)
        {
        	var $this= this;
        	if(refresh || $this.report.length==0)
	        {
	            
	        }
	        else
	            $this.def.resolve();
        }
    }
}]);
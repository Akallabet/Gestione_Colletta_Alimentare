
collettaApp.service("CaricoService", ["$q", '$routeParams', 'GetInfoFactory', 'CollettaService', function($q, $routeParams, GetInfoFactory, CollettaService)
{
  var def= $q.defer();
    return{
    	def: def,
    	prom: def.promise,
        prodottiTipi: [],
        modalButtons:[
            {label: "ok", type: "primary", active: true, action: "ok"},
            {label: "elimina", type: "danger", active: true, action: "del"},
            {label: "annulla", type: "warning", active: true, action: "dismiss"}
        ],
        modalOptions: {
            title: "Nuovo Carico",
            buttons: "Nuovo Carico"
        },
        lastId: null,
        modifyId: "",
        getInfo: function(refresh)
        {
        	var $this= this;
        	if(refresh || $this.prodottiTipi.length==0)
	        {
	            var prodottiTipiFactory= new GetInfoFactory(
                  {
                      id_colletta: CollettaService.colletta.filter(function(c){return c.attiva==1})[0].id
                  }
              );

	            prodottiTipiFactory.$save({
	                token: $routeParams.token,
	                property: 'prodotti_tipi'
	            },
	            function(result)
	            {
	                for (var i = 0; i < prodottiTipiFactory.comuni.length; i++) {
	                    $this.prodottiTipi.push(prodottiTipiFactory.comuni[i]);
	                }
                  $this.prodottiNomi = $this.prodottiTipi.map(function(p){ return {tipo: p}})
                  $this.prodottiTmpl= $this.prodottiNomi.map(function(p){ return {prodotto: p, kg: 0, scatole: 0}})
                  $this.newCarico= $this.prodottiNomi.map(function(p){ return {prodotto: p, kg: "", scatole: ""}})
                  $this.caricoTmpl= $this.prodottiNomi.map(function(p){ return {prodotto: p, kg: "", scatole: ""}})
	                $this.def.resolve();
	            });
	        }
	        else
	            $this.def.resolve();
        }
    }
}]);

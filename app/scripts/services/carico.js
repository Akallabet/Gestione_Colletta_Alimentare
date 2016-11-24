
collettaApp.service("CaricoService", ["$q", '$routeParams', 'GetInfoFactory', 'CollettaService', function($q, $routeParams, GetInfoFactory, CollettaService)
{
  var def= $q.defer();
    return{
    	def: def,
    	prom: def.promise,
      prodottiNomi: [],
        prodottiTipi: [],
        prodottiTmpl: [],
        newCarico: [],
        caricoTmpl: [],
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
        getInfo: function(idColletta)
        {
          var infoDefer = $q.defer()

        	var $this= this;
          var prodottiTipiFactory= new GetInfoFactory(
              {
                  id_colletta: idColletta || CollettaService.colletta.filter(function(c){return c.attiva==1})[0].id
              }
          );

          prodottiTipiFactory.$save({
              token: $routeParams.token,
              property: 'prodotti_tipi'
          },
          function(result)
          {
              for (var i = 0; i < prodottiTipiFactory.prodotti_tipi.length; i++) {
                  $this.prodottiTipi = prodottiTipiFactory.prodotti_tipi.sort(function(a,b){return parseInt(a.ordine)-parseInt(b.ordine);}).map(function(p){return p.nome;});
              }
              $this.prodottiNomi.length = 0
              $this.prodottiTmpl.length= 0
              $this.newCarico.length= 0
              $this.caricoTmpl.length = 0;
              $this.prodottiTipi.forEach(function(p){ $this.prodottiNomi.push({tipo: p})})
              $this.prodottiTipi.forEach(function(p){ $this.prodottiTmpl.push({prodotto: p, kg: 0, scatole: 0})})
              $this.prodottiTipi.forEach(function(p){ $this.newCarico.push({prodotto: p, kg: "", scatole: ""})})
              $this.prodottiTipi.forEach(function(p){ $this.caricoTmpl.push({prodotto: p, kg: "", scatole: ""})})
              $this.def.resolve();
              infoDefer.resolve();
          });

          return infoDefer.promise;
        }
    }
}]);

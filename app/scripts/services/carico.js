
collettaApp.service("CaricoService", ["$q",function($q)
{
  prodottiNomi: [
      "OLIO",
      "OMOGENIZZATI",
      "ALIMENTI INFANZIA",
      "TONNO",
      "CARNE IN SCATOLA",
      "PELATI",
      "LEGUMI",
      "PASTA",
      "RISO",
      "ZUCCHERO",
      "LATTE",
      "BISCOTTI",
      "VARIE"
  ]
    return{
        modalButtons:[
            {label: "ok", type: "primary", active: true, action: "ok"},
            {label: "elimina", type: "danger", active: true, action: "del"},
            {label: "annulla", type: "warning", active: true, action: "dismiss"}
        ],
        prodottiNomi: prodottiNomi.map(function(p){ return {tipo: p}}),
        prodottiTmpl: prodottiNomi.map(function(p){ return {prodotto: p, kg: 0, scatole: 0}}),
        modalOptions: {
            title: "Nuovo Carico",
            buttons: "Nuovo Carico"
        },
        newCarico: prodottiNomi.map(function(p){ return {prodotto: p, kg: "", scatole: ""}}),
        caricoTmpl: prodottiNomi.map(function(p){ return {prodotto: p, kg: "", scatole: ""}}),
        lastId: null,
        modifyId: ""
    }
}]);

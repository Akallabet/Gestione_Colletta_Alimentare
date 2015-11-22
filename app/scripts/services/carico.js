
collettaApp.service("CaricoService", ["$q",function($q)
{
    return{
        modalButtons:[
            {label: "ok", type: "primary", active: true, action: "ok"},
            {label: "elimina", type: "danger", active: true, action: "del"},
            {label: "annulla", type: "warning", active: true, action: "dismiss"}
        ],
        prodottiNomi: [
            {tipo:"OLIO"},
            {tipo:"OMOGENIZZATI"},
            {tipo:"ALIMENTI INFANZIA"},
            {tipo:"TONNO"},
            {tipo:"CARNE IN SCATOLA"},
            {tipo:"PELATI"},
            {tipo:"LEGUMI"},
            {tipo:"PASTA"},
            {tipo:"RISO"},
            {tipo:"ZUCCHERO"},
            {tipo:"LATTE"},
            {tipo:"BISCOTTI"},
            {tipo:"VARIE"}
        ],
        prodottiTmpl: [
            {prodotto:"OLIO", kg: 0, scatole: 0},
            {prodotto:"OMOGENIZZATI", kg: 0, scatole: 0},
            {prodotto:"ALIMENTI INFANZIA", kg: 0, scatole: 0},
            {prodotto:"TONNO", kg: 0, scatole: 0},
            {prodotto:"CARNE IN SCATOLA", kg: 0, scatole: 0},
            {prodotto:"PELATI", kg: 0, scatole: 0},
            {prodotto:"LEGUMI", kg: 0, scatole: 0},
            {prodotto:"PASTA", kg: 0, scatole: 0},
            {prodotto:"RISO", kg: 0, scatole: 0},
            {prodotto:"ZUCCHERO", kg: 0, scatole: 0},
            {prodotto:"LATTE", kg: 0, scatole: 0},
            {prodotto:"BISCOTTI", kg: 0, scatole: 0},
            {prodotto:"VARIE", kg: 0, scatole: 0}
        ],
        modalOptions: {
            title: "Nuovo Carico",
            buttons: "Nuovo Carico"
        },
        newCarico: [
            {prodotto:"OLIO", kg: "", scatole: ""},
            {prodotto:"OMOGENIZZATI", kg: "", scatole: ""},
            {prodotto:"ALIMENTI INFANZIA", kg: "", scatole: ""},
            {prodotto:"TONNO", kg: "", scatole: ""},
            {prodotto:"CARNE IN SCATOLA", kg: "", scatole: ""},
            {prodotto:"PELATI", kg: "", scatole: ""},
            {prodotto:"LEGUMI", kg: "", scatole: ""},
            {prodotto:"PASTA", kg: "", scatole: ""},
            {prodotto:"RISO", kg: "", scatole: ""},
            {prodotto:"ZUCCHERO", kg: "", scatole: ""},
            {prodotto:"LATTE", kg: "", scatole: ""},
            {prodotto:"BISCOTTI", kg: "", scatole: ""},
            {prodotto:"VARIE", kg: "", scatole: ""}
        ],
        caricoTmpl: [
            {prodotto:"OLIO", kg: "", scatole: ""},
            {prodotto:"OMOGENIZZATI", kg: "", scatole: ""},
            {prodotto:"ALIMENTI INFANZIA", kg: "", scatole: ""},
            {prodotto:"TONNO", kg: "", scatole: ""},
            {prodotto:"CARNE IN SCATOLA", kg: "", scatole: ""},
            {prodotto:"PELATI", kg: "", scatole: ""},
            {prodotto:"LEGUMI", kg: "", scatole: ""},
            {prodotto:"PASTA", kg: "", scatole: ""},
            {prodotto:"RISO", kg: "", scatole: ""},
            {prodotto:"ZUCCHERO", kg: "", scatole: ""},
            {prodotto:"LATTE", kg: "", scatole: ""},
            {prodotto:"BISCOTTI", kg: "", scatole: ""},
            {prodotto:"VARIE", kg: "", scatole: ""}
        ],
        lastId: null,
        modifyId: ""
    }
}]);
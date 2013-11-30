
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
            {tipo:"VARIE"}
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
            {prodotto:"VARIE", kg: "", scatole: ""}
        ],
        lastId: null,
        modifyId: ""
    }
}]);
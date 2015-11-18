'use strict';

angular.module('collettaApp')
  .service('dialogSupermercato', function dialogSupermercato() {
    // AngularJS will instantiate a singleton by calling "new" on this function
      return{
          modalButtons:[
            {label: "ok", type: "primary", active: true, action: 'ok'},
            {label: "elimina", type: "danger", active: true, action: 'del'},
            {label: "annulla", type: "warning", active: true, action: 'dismiss'}
          ],
          modalTitle: {info: ""},
          newCapoEquipe: {
            status: 0,
            nome: ""
          }
      }
  });

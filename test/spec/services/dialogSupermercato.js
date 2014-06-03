'use strict';

describe('Service: dialogSupermercato', function () {

  // load the service's module
  beforeEach(module('GestioneCollettaYeomanApp'));

  // instantiate service
  var dialogSupermercato;
  beforeEach(inject(function (_dialogSupermercato_) {
    dialogSupermercato = _dialogSupermercato_;
  }));

  it('should do something', function () {
    expect(!!dialogSupermercato).toBe(true);
  });

});

class AngularMockingbird {
  constructor(angularMock) {
    if(!window.angular.mock) {
      throw new Error('Module ngMock not found!');
    }
    if(!window.jasmine) {
      throw new Error('Jasmine not found!');
    }
    if(!window.jasmine.version) {
      throw new Error('Jasmine 2 required!');
    }
  }
  _getInjector() {
    let $injector;
    angular.mock.inject((_$injector_) => {
      $injector = _$injector_;
    });
    return $injector;
  }
  _getInjectables(...injectables) {
    let injector = this._getInjector();
    return injectables.map(service => {
      if(!injector.has(service)) {
        throw new Error(`Service '${service}' not found.`);
      }
      return {
          [service]: injector.get(service)
      };
    });
  }
  _getMethods(service) {
    if(typeof service !== "object" && typeof service !== "function") {
      throw new Error(`Only valid services can be mocked.`);
    }
    let methods = Object.keys(service).filter(prop => {
      return typeof service[prop] === "function";
    });
    if(methods.length === 0) {
      throw new Error(`Found no methods to mock.`);
    }
    return methods;
  }
  inject(...injectables) {
    return Object.assign({}, ...this._getInjectables(...injectables));
  }
  mock(service) {
    this._getMethods(service).map(prop => {
      service[prop] = jasmine.createSpy(prop).and.stub();
    });
  }
}

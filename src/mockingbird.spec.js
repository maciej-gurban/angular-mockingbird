describe('angular mockingbird', () => {

  let amInit, notMocked;
  beforeEach(() => {
    module($provide => {
      // Field values of a service that should not be mocked
      notMocked = [
        undefined,
        null,
        1,
        true,
        'foo',
        Symbol(),
        [],
        {}
      ];

      // Valid services
      $provide.service('ServiceFoo', function() {
        this.foo = () => {};
      });
      $provide.service('ServiceBar', function(ServiceFoo) {
        notMocked.forEach((value, index) => {
          this[`notMocked${index}`] = value;
        });
        this.fn = () => {
          ServiceFoo.foo();
        };
      });
      // Injectables that pass through $injector, but cannot be mocked
      $provide.value('injNumber', 1);
      $provide.value('injBoolean', true);
      $provide.value('injString', 'foo');
      $provide.value('injSymbol', Symbol());
      // Injectables that are iterable but cannot be mocked
      $provide.value('injArray', []);
      $provide.value('injObject', {});
      $provide.service('injNoFields', () => {});
      $provide.service('injNoMethods', () => {foo: true});
      // Injectables that will be rejected by $injector are not tested For
      // These include: undefined, null
    });
    amInit = () => {
      return new AngularMockingbird();
    };
  });

  describe('initialization', () => {
    let _ngMock  = {};
    let _jasmine = {};
    // For test purposes, we need to erase objects made availabe on 'window'
    // To prevent false results in consecutive test cases, we need to restore
    // the original values back to their rightful locations
    beforeEach(() => {
      _ngMock = Object.assign({}, window.angular.mock);
      _jasmine = Object.assign({}, window.jasmine);
    });
    afterEach(() => {
       window.angular.mock = Object.assign({}, _ngMock);
       window.jasmine = Object.assign({}, _jasmine);
    });
    it(`should throw if ngMock is missing`, () => {
      window.angular.mock = undefined;
      expect(amInit).toThrowError('Module ngMock not found!');
    });
    it(`should throw if Jasmine is missing`, () => {
      window.jasmine = undefined;
      expect(amInit).toThrowError('Jasmine not found!');
    });
    it(`should throw if Jasmine older than v2 is found`, () => {
      window.jasmine.version = undefined;
      expect(amInit).toThrowError('Jasmine 2 required!');
    });
  });

  describe('injection', () => {
    it(`should throw if requested service hadn't been registered`, () => {
      expect(() => {
        amInit().inject('NonexistentService');
      }).toThrowError(`Service 'NonexistentService' not found.`)
    });
    it(`should successfully return requested service`, () => {
      let diContainer = amInit().inject('ServiceFoo');
      expect(diContainer.ServiceFoo).toBeDefined();
    });
    it(`should successfully return multiple requested services`, () => {
      let diContainer = amInit().inject('ServiceFoo', 'ServiceBar');
      expect(diContainer.ServiceFoo).toBeDefined();
      expect(diContainer.ServiceBar).toBeDefined();
    });
  });

  describe('mocking', () => {
    let mock = (obj) => {
      return () => {
        amInit().mock(obj);
      };
    };
    it(`should throw if provided injectable is not `, () => {
      let diContainer = amInit().inject(
        'injNumber',
        'injBoolean',
        'injString',
        'injSymbol'
      );
      let err = `Only valid services can be mocked.`;
      expect(mock(diContainer.inj3)).toThrowError(err);
      expect(mock(diContainer.inj4)).toThrowError(err);
      expect(mock(diContainer.inj5)).toThrowError(err);
      expect(mock(diContainer.inj6)).toThrowError(err);
      expect(mock(diContainer.inj7)).toThrowError(err);
      expect(mock(diContainer.inj8)).toThrowError(err);
    });
    it(`should throw if provided injectable has no methods`, () => {
      let diContainer = amInit().inject(
        'injNoFields',
        'injNoMethods',
        'injArray',
        'injObject'
      );
      let err = `Found no methods to mock.`;
      expect(mock(diContainer.injNoFields)).toThrowError(err);
      expect(mock(diContainer.injNoMethods)).toThrowError(err);
      expect(mock(diContainer.injArray)).toThrowError(err);
      expect(mock(diContainer.injObject)).toThrowError(err);
    });
    it(`should replace methods with their mocks`, () => {
      let diContainer = amInit().inject('ServiceBar');
      mock(diContainer.ServiceBar)();
      expect(diContainer.ServiceBar.fn.and).toBeDefined();
    });
    it(`should preserve other fields`, () => {
      let diContainer = amInit().inject('ServiceBar');
      mock(diContainer.ServiceBar)();
      notMocked.map((value, index) => {
        expect(diContainer.ServiceBar[`notMocked${index}`]).toEqual(value);
      });
    });
  });
});

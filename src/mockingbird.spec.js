describe('angular mockingbird', () => {

  let am;
  const notMocked = [
    1, 1.1, NaN, true, '', Symbol(), [], {}
  ];
  const ServiceFoo = function() {
    this.foo = () => {};
  };
  const ServiceBar = function(ServiceFoo) {
    notMocked.forEach((value, index) => {
      this[`notMocked${index}`] = value;
    });
    this.fn = ServiceFoo.foo;
  };

  angular.module('myApp', [])
    .service('ServiceFoo', ServiceFoo)
    .service('ServiceBar', ServiceBar);

  beforeEach(() => {
    angular.mock.module('myApp');
    am = () => new Mockingbird();
  });

  describe('initialization', () => {
    let _ngMock  = {};
    let _jasmine = {};
    // For test purposes, we need to erase objects made availabe on 'window'.
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
      expect(am).toThrowError('Module ngMock not found!');
    });
    it(`should throw if Jasmine is missing`, () => {
      window.jasmine = undefined;
      expect(am).toThrowError('Jasmine not found!');
    });
    it(`should throw if Jasmine older than v2 is found`, () => {
      window.jasmine.version = undefined;
      expect(am).toThrowError('Jasmine 2 required!');
    });
  });

  describe('injection', () => {
    it(`should throw if requested service hadn't been registered`, () => {
      expect(() => {
        am().inject('NonexistentService');
      }).toThrowError(`Service 'NonexistentService' not found.`)
    });
    it(`should successfully return an existing service`, () => {
      let diContainer = am().inject('ServiceFoo');
      expect(diContainer.ServiceFoo).toBeDefined();
    });
    it(`should successfully return multiple existing services`, () => {
      let diContainer = am().inject('ServiceFoo', 'ServiceBar');
      expect(diContainer.ServiceFoo).toBeDefined();
      expect(diContainer.ServiceBar).toBeDefined();
    });
  });

  describe('mocking', () => {
    let mock = (obj) => {
      return () => {
        am().mock(obj);
      };
    };
    it(`should throw when mocking of invalid injectable attempted`, () => {
      let err = `Only valid services can be mocked.`;
      expect(mock(1)).toThrowError(err);
      expect(mock(1.1)).toThrowError(err);
      expect(mock(NaN)).toThrowError(err);
      expect(mock("")).toThrowError(err);
    });
    it(`should throw when valid injectable has no methods to mock`, () => {
      let err = `Found no methods to mock.`;
      expect(mock([])).toThrowError(err);
      expect(mock({})).toThrowError(err);
      expect(mock(() => {})).toThrowError(err);
      expect(mock(() => {foo: true})).toThrowError(err);
    });
    it(`should replace methods with their mocks`, () => {
      let diContainer = am().inject('ServiceBar');
      mock(diContainer.ServiceBar)();
      expect(diContainer.ServiceBar.fn.and).toBeDefined();
    });
    it(`should allow to override default mock of a method`, () => {
      let diContainer = am().inject('ServiceBar');
      mock(diContainer.ServiceBar)();
      diContainer.ServiceBar.fn.and.returnValue(1);
      expect(diContainer.ServiceBar.fn()).toEqual(1);
    });
    it(`should preserve other fields`, () => {
      let diContainer = am().inject('ServiceBar');
      mock(diContainer.ServiceBar)();
      notMocked.map((value, index) => {
        expect(diContainer.ServiceBar[`notMocked${index}`]).toEqual(value);
      });
    });
  });
});

# Angular Mockingbird

Simplified dependency injection and service mocking.

## Installation

```
npm install angular-mockingbird --save-dev
```

## Dependencies
+ [Angular mocks](https://www.npmjs.com/package/angular-mocks)
+ [Jasmine 2.x](https://www.npmjs.com/package/jasmine)

## Usage

### Initialization

```
var am = new AngularMockingbird();
```

### Injection


The `inject()` method returns an object; each service (or other injectable) is a property of that object, and is available at key matching requested service name.

#### Syntax
```
am.inject(arg1[, arg][, ...]);
```

**Parameters**

+ **arg1, arg2, ...** - Names of injectables to return.

```
// Without Mockingbird
var ServiceFoo, ServiceBar;      
beforeEach(inject(function(_ServiceFoo_, _ServiceBar_) {
  ServiceFoo = _ServiceFoo_;
  ServiceBar = _ServiceBar_;
});
// Access each as 'ServiceFoo', 'ServiceBar'

// With Mockingbird
var di;
beforeEach(function() {
  di = am.inject(
    'ServiceFoo',
    'ServiceBar'
  );
});
// Access each as 'di.ServiceFoo', 'di.ServiceBar'
```


### Mocking

The `mock()` method replaces all functions found in object properties with Jasmine spies. **This method mutates the object passed to it**.

#### Syntax
```
am.mock(arg);
```

**Parameters**

+ **arg** - Service object (injected previously)

```
// Example service
app.service(ServiceFoo, function() {
  this.foo = function() {};
  this.bar = function() {};
  this.baz = function() {};
});

// Without Mockingbird
spyOn(ServiceFoo, 'foo').and.stub();
spyOn(ServiceFoo, 'bar').and.stub();
spyOn(ServiceFoo, 'baz').and.stub();

// With Mockingbird
am.mock(di.ServiceFoo);
```

### Putting it all together

```
describe('test', function() {
  let am, di;
  beforeEach(module('myApp'));
  beforeEach(function() {
    am = new AngularMockingbird();
    di = am.inject(
      'ServiceFoo',
      'ServiceBar'
    );
    am.mock(di.ServiceBar);
  }):
  it('should do something', function() {
    di.ServiceFoo.foo();
    expect(di.ServiceFoo.foo).toHaveBeenCalled();
  });
});
```

#### Notes

To make it clear when we're dealing with service mocks, and when with their actual implementations, the following pattern could be used:

```
di = am.inject(
  'ServiceFoo'
);
mock = am.inject(
  'ServiceBar'
);
am.mock(mock.ServiceBar);
```

### Development & testing

Start to pulling in all the dependencies:
```
npm install
```

To run the tests, execute in the root of the project:
```
npm test
```

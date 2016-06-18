# Angular Mockingbird

Simplified dependency injection and service mocking.

## Installation

````
npm install angular-mockingbird --save-dev
````

## Dependencies
+ [Angular mocks](https://www.npmjs.com/package/angular-mocks)
+ [Jasmine 2.x](https://www.npmjs.com/package/jasmine)

## Usage

### Importing

You'll need to include `./dist/mockingbird.js` into `files` section in your karma.conf.js for the module to be available in your tests. Mockingbird needs to be imported after both Angular and Angular Mocks have been imported. Example:

````javascript
files: [
  './node_modules/angular/angular.js',
  './node_modules/angular-mocks/angular-mocks.js',
  './node_modules/angular-mockingbird/dist/mockingbird.js',
  ...
  // your test files
]
````

### Initialization

````javascript
// Import using Browserify (ES5):
var Mockingbird = require('angular-mockingbird);
// or using JS Modules (ES6):
import Mockingbird from 'angular-mockingbird';

var am = new Mockingbird();
````

### Injection


The `inject()` method returns an object; each service (or other injectable) is a property of that object, and is available at key matching requested service name.

#### Syntax
````javascript
am.inject(arg1[, arg][, ...]);
````

**Parameters**

+ **arg1, arg2, ...** - Names of injectables to return.

````javascript
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
````


### Mocking

The `mock()` method replaces all functions found in object properties with Jasmine spies. **This method mutates the object passed to it**.

#### Syntax
````javascript
am.mock(arg);
````

**Parameters**

+ **arg** - Service object (injected previously)

````javascript
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
````

### Putting it all together

````javascript
describe('test', function() {
  let am, di;
  beforeEach(module('myApp'));
  beforeEach(function() {
    am = new Mockingbird();
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
````

#### Notes

To make it clear when we are dealing with service mocks, and when with their actual implementations, the following pattern could be used:

````javascript
di = am.inject(
  'ServiceFoo'
);
mock = am.inject(
  'ServiceBar'
);
am.mock(mock.ServiceBar);
````

### Development & testing

Start to pulling in all the dependencies:
````
npm install
````

To run the tests, execute in the root of the project:
````
npm test
````

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AngularMockingbird = function () {
  function AngularMockingbird(angularMock) {
    _classCallCheck(this, AngularMockingbird);

    if (!window.angular.mock) {
      throw new Error('Module ngMock not found!');
    }
    if (!window.jasmine) {
      throw new Error('Jasmine not found!');
    }
    if (!window.jasmine.version) {
      throw new Error('Jasmine 2 required!');
    }
  }

  _createClass(AngularMockingbird, [{
    key: '_getInjector',
    value: function _getInjector() {
      var $injector = void 0;
      angular.mock.inject(function (_$injector_) {
        $injector = _$injector_;
      });
      return $injector;
    }
  }, {
    key: '_getInjectables',
    value: function _getInjectables() {
      var injector = this._getInjector();

      for (var _len = arguments.length, injectables = Array(_len), _key = 0; _key < _len; _key++) {
        injectables[_key] = arguments[_key];
      }

      return injectables.map(function (service) {
        if (!injector.has(service)) {
          throw new Error('Service \'' + service + '\' not found.');
        }
        return _defineProperty({}, service, injector.get(service));
      });
    }
  }, {
    key: '_getMethods',
    value: function _getMethods(service) {
      if ((typeof service === 'undefined' ? 'undefined' : _typeof(service)) !== "object" && typeof service !== "function") {
        throw new Error('Only valid services can be mocked.');
      }
      var methods = Object.keys(service).filter(function (prop) {
        return typeof service[prop] === "function";
      });
      if (methods.length === 0) {
        throw new Error('Found no methods to mock.');
      }
      return methods;
    }
  }, {
    key: 'inject',
    value: function inject() {
      return Object.assign.apply(Object, [{}].concat(_toConsumableArray(this._getInjectables.apply(this, arguments))));
    }
  }, {
    key: 'mock',
    value: function mock(service) {
      this._getMethods(service).map(function (prop) {
        service[prop] = jasmine.createSpy(prop).and.stub();
      });
    }
  }]);

  return AngularMockingbird;
}();

},{}]},{},[1]);
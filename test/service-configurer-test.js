/**
 * Copyright [2015] Quirino Brizi - quirino.brizi@gmail.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var assert = require("assert"),
  should = require('should'),
  sinon = require('sinon'),
  mockery = require('mockery');

describe('service configurer module', function() {

  var express,
    expressInstance,
    passport,
    bodyParser,
    auth,
    serviceConfigurer,
    options,
    authMock,
    passportMock,
    bodyParserMock,
    expressMock;

  before(function() {

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    expressInstance = {
      use: function() {},
      get: function() {},
      all: function() {},
      listen: function() {}
    };

    express = function() {
      return expressInstance;
    };
    passport = {
      initialize: function() {},
      use: function() {},
      authenticate: function() {}
    };
    bodyParser = {
      json: function() {}
    };
    auth = {
      instance: function() {}
    };
    serviceConfigurer,
    options = {
      get: function() { /*get*/ }
    };

    authMock = sinon.mock(auth);
    passportMock = sinon.mock(passport);
    bodyParserMock = sinon.mock(bodyParser);
    expressMock = sinon.mock(expressInstance);

    mockery.registerMock('express', express);
    mockery.registerMock('passport', passport);
    mockery.registerMock('body-parser', bodyParser);
    mockery.registerMock('./authentication-strategy-factory', auth);

    serviceConfigurer = require('../lib/service-configurer');
  });

  after(function() {
    mockery.disable();

    authMock.restore();
    passportMock.restore();
    bodyParserMock.restore();
    expressMock.restore();
  });

  describe('configure', function() {
    it('should throw error when configuration options are not provided', function() {
      try {
        serviceConfigurer.configure();
        assert.fail("configure method should have thrown error as options has not been provided");
      } catch (e) {
        assert.equal(e.message, "configuration options must be provided");
      }
    });

    it('should throw error when whitelist endpoint configuration is not valid', function() {
      var authenticationConf = {
          "type": "basic",
          "provider": {
            "module": "../providers/authentication",
            "function": "basic"
          },
          "whitelist": [{
            "verb": "GET",
            "path": "/version"
          }]
        },
        authInstanceExpectation = authMock
        .expects('instance')
        .withExactArgs(authenticationConf),
        passportInitializeExpectation = passportMock
        .expects('initialize')
        .once(),
        bodyParserJsonExpectation = bodyParserMock
        .expects('json')
        .once(),
        expressUseExpectations = expressMock
        .expects('use')
        .twice();
      // .withArgs(passportInitializeExpectation, bodyParserJsonExpectation);
      var stub = sinon.stub(options, 'get');
      try {
        stub.withArgs('authentication')
          .returns(authenticationConf);
        stub.withArgs('authentication.whitelist')
          .returns([{
            "verb": "GET",
            "path": "/version"
          }]);
        serviceConfigurer.configure(options);
        assert.fail("configure method should have thrown error as valid whitelist endpoint configuration has not been provided");
      } catch (e) {
        assert.equal(e.message, "whitelist path should be on the form /stevedore/.*");
      }
      authMock.verify();
      passportMock.verify();
      bodyParserMock.verify();
      expressMock.verify();
      stub.restore();
    });

    it('should configure whitelist endpoint as well as proxy endpoint', function() {
      var authInstanceExpectation = sinon.mock(auth)
        .expects('instance'),
        passportInitializeExpectation = sinon.mock(passport)
        .expects('initialize'),
        expressUseExpectations = sinon.mock(expressInstance)
        .expects('use')
        .twice(),
        bodyParserJsonExpectation = sinon.mock(bodyParser)
        .expects('json'),
        authenticationConf = {
          "type": "basic",
          "provider": {
            "module": "../providers/authentication",
            "function": "basic"
          },
          "whitelist": [{
            "verb": "GET",
            "path": "/stevedore/version"
          }]
        },
        stub = sinon.stub(options, 'get');

      stub.withArgs('authentication')
        .returns(authenticationConf);
      stub.withArgs('authentication.whitelist')
        .returns([{
          "verb": "GET",
          "path": "/stevedore/version"
        }]);
      serviceConfigurer.configure(options);

      passportInitializeExpectation.once();
      bodyParserJsonExpectation.once();
      authInstanceExpectation.withExactArgs(authenticationConf);
      expressUseExpectations.withArgs(passportInitializeExpectation, bodyParserJsonExpectation);
      stub.restore();
    });
  });
});

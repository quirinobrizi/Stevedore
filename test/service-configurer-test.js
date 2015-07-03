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

  var express = function () {

    },
    passport = {},
    bodyParser = {
      json: function() {}
    },
    auth = function () {
    },
    serviceConfigurer;

  before(function () {

    mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
    });
    mockery.registerMock('express', express);
    mockery.registerMock('passport', passport);
    mockery.registerMock('bodyParser', bodyParser);
    mockery.registerMock('./authentication-strategy-factory', auth);

    serviceConfigurer = require('../lib/service-configurer');
  });

  after(function() {
      mockery.disable();
  });

  describe('configure', function() {
    it('should throw error when configuration options are not provided', function() {
      try {
        serviceConfigurer.configure();
        assert.fail("configure method should have thrown error as options has not been provided");
      } catch(e) {
        assert.equal(e.message, "configuration options must be provided");
      }
    });

    it('should throw error when whitelist endpoint configuration is not valid', function() {
      try {
        serviceConfigurer.configure();
        assert.fail("configure method should have thrown error as options has not been provided");
      } catch(e) {
        assert.equal(e.message, "configuration options must be provided");
      }
    });
  });
});

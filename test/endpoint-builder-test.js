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
  EndpointBuilder = require('../lib/endpoint-builder');

describe('stevedore EndpointBuilder module', function() {
  describe("endpoint should be built with authenticator", function() {
    var express = {
      get: function (path, authenticator, router) {
        path.should.be.mypath
        assert.deepEqual(authenticator, {});
        assert.deepEqual(router, {});
      }
    };
    new EndpointBuilder().withVerb('get').withPath('mypath').withRouter({}).withAuthenticator({}).build(express);
  });

  describe("endpoint should be built without authenticator", function() {
    var express = {
      get: function (path, router) {
        path.should.be.mypath
        assert.deepEqual(router, {});
        assert.equal(arguments.length, 2)
      }
    };
    new EndpointBuilder().withVerb('get').withPath('mypath').withRouter({}).build(express);
  });
});

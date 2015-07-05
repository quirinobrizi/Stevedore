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
  model = require('../lib/model');

describe('stevedore model module', function() {
  describe("credential model should have getter for username", function() {
    var credential = new model.Credential("test", "stevedore");
    credential.getUsername().should.be.test;
  });

  describe("credential model should have getter for password", function() {
    var credential = new model.Credential("test", "stevedore");
    credential.getPassword().should.be.stevedore;
  });
});
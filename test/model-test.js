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
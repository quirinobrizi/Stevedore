var assert = require("assert"),
  should = require('should'),
  auth = require('../lib/stevedore-auth');

describe('stevedore authentication module', function() {

  describe('instance', function() {
    it('should throw error when authentication type is not supported', function() {
      var options = {
        type: 'unsupported'
      };
      try {
        auth.instance(options);
        assert.fail("instance method should have thrown error");
      } catch (e) {
        assert.equal(e.message, "requested authentication type [unsupported] is not supported");
      }
    });

    it('should throw error when authentication provider is not provided', function() {
      var options = {
        type: 'basic'
      };
      try {
        auth.instance(options);
        assert.fail("instance method should have thrown error as authentication provider is not defined");
      } catch (e) {
        assert.equal(e.message, "authentication provider must be provided");
      }
    });

    it('should throw error when authentication provider module is not defined', function() {
      var options = {
        type: 'basic',
        provider: {
          "function": "my-function"
        }
      };
      try {
        auth.instance(options);
        assert.fail("instance method should have thrown error as authentication provider module is not defined");
      } catch (e) {
        assert.equal(e.message, "authentication provider should be provided using the form: module and function");
      }
    });

    it('should throw error when authentication provider function is not defined', function() {
      var options = {
        type: 'basic',
        provider: {
          "module": "my-module"
        }
      };
      try {
        auth.instance(options);
        assert.fail("instance method should have thrown error as authentication provider function is not defined");
      } catch (e) {
        assert.equal(e.message, "authentication provider should be provided using the form: module and function");
      }
    });

    it('should create a valid authenticator', function() {
      var options = {
        type: 'basic',
        provider: {
          "module": "../test/fixtures/authentication",
          "function": "my-function"
        }
      };
      var authenticator = auth.instance(options);
      assert.notEqual(authenticator, null);
    });

    it('authenticator should use defined authentication provider', function() {
      var options = {
        type: 'basic',
        provider: {
          "module": "../test/fixtures/authentication",
          "function": "basic"
        }
      };
      var authenticator = auth.instance(options);
      assert.notEqual(authenticator, null);
      authenticator.success = function(actual) {
        actual.should.be.true;
      };
      authenticator.authenticate({
        "headers": {
          "authorization": "Basic dGVzdDpzdGV2ZWRvcmU="
        }
      });
    });
  });
});
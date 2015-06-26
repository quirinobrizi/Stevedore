var logger = require('./logger').getInstance(),
  BasicStrategy = require('passport-http').BasicStrategy,
  Credential = require('./model').Credential;

module.exports = {

  /**
   * Authenticate a user using credentials retrieved from authorization header
   * configured for basic authentication.
   *
   * @param  {string}   provider The external authentication provider as a module.function. The provider function should
   *                             accepts an object as a parameter that contains the username and password extracted from
   *                             the HTTP authorization header and return a boolean value true if the authentication is
   *                             successful, false otherwise.
   * @return {object}            A new basic authentication strategy instance
   */
  basic: function(provider) {
    if (!provider) {
      throw new Error('authentication provider must be provided');
    }
    var idx = provider.lastIndexOf('.');
    if (idx < 0) {
      throw new Error('authentication provider should be provided using the form: module.function');
    }
    var module = require(provider.substring(0, idx)),
      fcn = provider.substring(idx + 1);
    logger.info("using %s as authentication provider", provider);
    return new BasicStrategy(function(username, password, done) {
      logger.info("validating authentication for user [%s]", username);
      credential = new Credential(username, password);
      var authenticated = module[fcn](credential);
      return done(null, authenticated);
    });
  }
};

var logger = require('./logger').getInstance(),
  BasicStrategy = require('passport-http').BasicStrategy;

module.exports = {

  /**
   * Authenticate a user using credentials retrieved from authorization header
   * configured for basic authentication
   * @param  {string}   username The provided username
   * @param  {string}   password The provided password
   * @param  {Function} done     A function used to indicate the output of the
   *                             performed authentication.
   * @return {boolean}           The result of the evaluated done function
   */
  basic: function() {
    return new BasicStrategy(function(username, password, done) {
      logger.info("validating authentication for user [%s]", username);
      return done(null, true);
    });
  }
};
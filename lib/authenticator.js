var logger = require('./logger').getInstance(),
  Credential = require('./model').Credential,
  BasicStrategy = require('passport-http').BasicStrategy;

/**
 * Create an authentication module instance based on the requested option. The authentication modules are
 * created in a factory fashion meaning that each invocation of this method will return a new authentication
 * module instance.
 *
 * @param  {object}   options The configured authentication options.
 *                               {
 *                                 "type": "basic",
 *                                 "provider": {
 *                                   "module": "my-auth-module",
 *                                   "function": "my-auth-function"
 *                                 }
 *                               }
 *                             The provider function accepts as a parameters: an object that contains
 *                             the username and password extracted from the HTTP authorization header
 *                             and a callback that should be infoved when the authentication is performed.
 *                             The calback accept two parameters an error and a flag that will be true on
 *                             succesful authentication false otherwise.
 *
 *                             function(credential, cb) {
 *                               cb(null, credential.username === 'q' && credential.password === 'q');
 *                             }
 *
 * @return {object}            A new authentication strategy instance
 */
var getAuthenticationProviderInstance = function(options) {
  var type = options.type;
  if (type === 'basic') {
    return new Basic(options.provider);
  } else {
    throw new Error('requested authentication type [' + type + '] is not supported');
  }
}
exports.instance = getAuthenticationProviderInstance;


/**
 * Authenticate a user using credentials retrieved from authorization header
 * configured for basic authentication.
 *
 * @param  {object}   provider The external authentication provider as a module and function.
 *                               {
 *                                 "module": "my-auth-module",
 *                                 "function": "my-auth-function"
 *                               }
 *                             The provider function accepts as a parameters: an object that contains
 *                             the username and password extracted from the HTTP authorization header
 *                             and a callback that should be infoved when the authentication is performed.
 *                             The calback accept two parameters an error and a flag that will be true on
 *                             succesful authentication false otherwise.
 *
 *                             function(credential, cb) {
 *                               cb(null, credential.username === 'q' && credential.password === 'q');
 *                             }
 *
 * @return {object}            A new basic authentication strategy instance
 */
var Basic = function(provider) {
  if (!provider) {
    throw new Error('authentication provider must be provided');
  }
  if (!provider.module || !provider['function']) {
    throw new Error('authentication provider should be provided using the form: module and function');
  }
  var module = require(provider.module),
    fcn = provider['function'];
  logger.info('using %j as authentication provider', provider);
  return new BasicStrategy(function(username, password, done) {
    logger.debug('validating authentication for user [%s]', username);
    module[fcn](new Credential(username, password), function(error, authenticated) {
      logger.debug('authentication check executed with status: %s', authenticated);
      done(error, authenticated);
    });
  });
}
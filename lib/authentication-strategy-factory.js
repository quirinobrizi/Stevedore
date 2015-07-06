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

'use strict'

var logger = require('./logger').getInstance(),
  Credential = require('./model').Credential,
  BasicStrategy = require('passport-http').BasicStrategy,
  ClientCertStrategy = require('passport-client-cert').Strategy;

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
  var STRATEGIES = {
    'basic': Basic,
    'client-cert': ClientCertificateStrategy
  };
  if (!type) {
    throw new Error('authentication type must be provided');
  }
  if (!(type in STRATEGIES)) {
    throw new Error('requested authentication type [' + type + '] is not supported');
  }
  if (!options.provider) {
    throw new Error('authentication provider must be provided');
  }
  if (!options.provider.module || !options.provider['function']) {
    throw new Error('authentication provider should be provided using the form: module and function');
  }
  logger.debug('Configured strategies: [%j]', STRATEGIES);
  return new STRATEGIES[type](options.provider);
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
};

/**
 * Authenticate a user using a client certificate.
 *
 * @param  {object}   provider The external authentication provider as a module and function.
 *                               {
 *                                 "module": "my-auth-module",
 *                                 "function": "my-auth-function"
 *                               }
 *                             The provider function accepts as a parameters: the provided client certificate
 *                             and a callback that should be informed when the authentication is performed.
 *                             The calback accept two parameters an error and a flag that will be true on
 *                             succesful authentication false otherwise.
 *
 *                             function(certificate, cb) {
 *                               cb(null, certificate.subject.cn === 'valid subject cn');
 *                             }
 *
 * @return {object}            A new client certificate authentication strategy instance
 */
var ClientCertificateStrategy = function(provider) {
  var module = require(provider.module),
    fcn = provider['function'];
  logger.info('using %j as authentication provider for client certificate authentication', provider);
  return new ClientCertStrategy(function(certificate, done) {
    logger.debug('validating authentication using provided certificate [%j]', certificate);
    module[fcn](certificate, function(error, authenticated) {
      logger.debug('authentication check executed with status: %s', authenticated);
      done(error, authenticated);
    });
  });
};

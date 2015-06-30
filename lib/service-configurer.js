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

var passport = require('passport'),
  bodyParser = require('body-parser'),
  stevedore = require('./stevedore')(),
  auth = require('./authentication-strategy-factory');

/**
 * Configure stevedore accordingly to the configuration defined by the user.
 * @param  {object} options The configuration options
 * @param {object}  express The express instance to configure
 * @return {object}         The configured express instance
 */
module.exports.configure = function(options, express) {
  return new ServiceConfigurer(options, express).configure();
}

function ServiceConfigurer(options, express) {
  this.options = options;
  this.express = express;

  this.configure = function() {
    express.use(passport.initialize());
    express.use(bodyParser.json());
    this.configurePassport();
    this.configureExpress();
  };

  this.configurePassport = function() {
    passport.use(auth.instance(this.options.get('authentication')));
  };

  this.configureExpress = function() {
    express.all('/stevedore/*', passport.authenticate(this.options.get('authentication.type'), {
      session: false
    }), stevedore.docker);
    express.listen(this.options.get('server.port'));
  };
}
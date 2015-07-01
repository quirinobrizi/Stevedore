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
  auth = require('./authentication-strategy-factory'),
  logger = require('./logger').getInstance();

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
    this.configurePassport();
    this.configureExpress();
  };

  this.configurePassport = function() {
    this.express.use(passport.initialize());
    passport.use(auth.instance(this.options.get('authentication')));
  };

  this.configureExpress = function() {
    this.express.use(bodyParser.json());
    console.log("express", this.express['get']);
    var stevedore = require('./stevedore')(this.options);
    var whitelist = this.options.authentication.whitelist;
    for (var key in whitelist) {
      var endpoint = whitelist[key];
      logger.info("whitelisting endpoint [%j]", endpoint);
      // new EndpointBuilder(this.express).withPath("/stevedore/" + endpoint.path).withVerb(endpoint.verb)
      //   .withRouter(stevedore.docker)
      //   .build();
    }
    new EndpointBuilder(this.express).withPath("/stevedore/*").withVerb('all')
      .withRouter(stevedore.docker)
      .withAuthenticator(passport.authenticate(this.options.get('authentication.type'), {
        session: false
      }))
      .build();
    // this.express.all('/stevedore/*', passport.authenticate(this.options.get('authentication.type'), {
    //   session: false
    // }), stevedore.docker);
    this.express.listen(this.options.get('server.port'));
  };
}

function EndpointBuilder(express) {

  this.express = express;

  this.withVerb = function(verb) {
    this.verb = verb;
    return this;
  };

  this.withPath = function(path) {
    this.path = path;
    return this;
  };

  this.withAuthenticator = function(authenticator) {
    this.authenticator = authenticator;
    return this;
  };

  this.withRouter = function(router) {
    this.router = router;
    return this;
  };

  this.build = function() {
    if (this.authenticator) {
      this.express[this.verb.toLowerCase()](this.path, this.authenticator, this.router);
    } else {
      this.express[this.verb.toLowerCase()](this.path, this.router);
    }
  };
}

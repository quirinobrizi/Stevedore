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

module.exports = function EndpointBuilder() {

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

  this.build = function(express) {
    if (this.authenticator) {
      express[this.verb.toLowerCase()](this.path, this.authenticator, this.router);
    } else {
      express[this.verb.toLowerCase()](this.path, this.router);
    }
  };
}

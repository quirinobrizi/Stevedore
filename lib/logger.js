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

module.exports.getInstance = function() {
  return new Logger();
};

var Logger = function() {

  if (Logger.prototype._instance) {
    return Logger.prototype._instance;
  }
  Logger.prototype._instance = this;

  this.debug = function(fmt) {
    console.log(fmt, parseArguments(arguments));
  };
  this.info = function(fmt) {
    console.info(fmt, parseArguments(arguments));
  };
  this.warn = function(fmt) {
    console.warn(fmt, parseArguments(arguments));
  };
  this.error = function(fmt) {
    console.error(fmt, parseArguments(arguments));
  };

  function parseArguments(args) {
    if (args.length > 1) {
      return Array.prototype.slice.call(args, 1);
    }
    return null;
  }
};
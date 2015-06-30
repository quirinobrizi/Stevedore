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

var request = require('request'),
  _ = require('underscore'),
  logger = require('./logger').getInstance();

module.exports = function(options) {

  logger.debug('create stevedore proxy with options: [%j]', options);

  function prepareRequestOptions(req) {
    var options = {
      method: req.method,
      url: buildUrl(req)
    };

    if (_.contains(['post', 'put'], req.method.toLowerCase())) {
      options.json = req.body;
    }

    if (Object.keys(req.query).length > 0) {
      options.qs = req.query
    }

    return options;
  }

  function buildUrl(req) {
    return 'http://unix://var/run/docker.sock:' + req.path.substring(10);
  }

  function setResponseHeaders(clientResponse, containerResponse) {
    clientResponse.set(_.pick(containerResponse.headers, function(value, key) {
      return !_.contains(['connection'], key);
    }));
  }

  return {
    docker: function(req, resp) {
      var opts = prepareRequestOptions(req);
      logger.info(opts);
      request(opts, function(error, response, body) {
        if (error) {
          logger.error('unable send request to docker', error);
          resp.send(error).end();
        }
        setResponseHeaders(resp, response);
        resp.status(response.statusCode).send(body).end();
      });
    }
  }
};
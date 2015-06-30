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
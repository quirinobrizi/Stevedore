var cluster = require('cluster'),
  os = require('os'),
  express = require('express')(),
  passport = require('passport'),
  bodyParser = require('body-parser'),
  config = require('config'),
  logger = require('./logger').getInstance(),
  stevedore = require('./stevedore')(),
  auth = require('./stevedore-auth');

if (cluster.isMaster) {
  /*
   * Fork workers
   */
  for (var i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    logger.warn('worker %d died, received signal %s', worker.process.pid || code, signal);
  });

  cluster.on('online', function(worker) {
    logger.info('Worker %d forked', worker.process.pid);
  });
} else {
  /*
   * Execute application on each worker
   */
  express.use(passport.initialize());
  express.use(bodyParser.json());
  passport.use(auth.instance(config.get('authentication')));
  express.all('/stevedore/*', passport.authenticate(config.get('authentication.type'), {
    session: false
  }), stevedore.docker);
  express.listen(config.get('server.port'));
}
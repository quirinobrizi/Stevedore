var cluster = require('cluster'),
  os = require('os'),
  express = require('express')(),
  passport = require('passport'),
  bodyParser = require('body-parser'),
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
    logger.warn('worker %d died', worker.process.pid);
  });

  cluster.on('online', function(worker) {
    logger.info("Worker %d forked", worker.process.pid);
  });
} else {
  /*
   * Execute application on each worker
   */
  express.use(passport.initialize());
  express.use(bodyParser.json());
  // TODO: the authorization strategy must be configurable
  passport.use(new auth.basic('../providers/authentication.basic'));
  express.all('/stevedore/*', passport.authenticate('basic', {
    session: false
  }), stevedore.docker);
  express.listen(3000);
}

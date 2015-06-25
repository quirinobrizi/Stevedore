var cluster = require('cluster');
var os = require('os');
var express = require('express')();
var bodyParser = require('body-parser');

var logger = require('./logger').getInstance();
var stevedore = require('./stevedore')();

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
  express.use(bodyParser.json());
  express.all('/stevedore/*', stevedore.docker);
  express.listen(3000);
}
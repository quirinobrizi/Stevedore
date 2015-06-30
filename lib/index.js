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

var cluster = require('cluster'),
  os = require('os'),
  express = require('express')(),
  config = require('config'),
  logger = require('./logger').getInstance(),
  serviceConfigurer = require('./service-configurer');

if (cluster.isMaster) {
  /*
   * Fork workers
   */
  for (var i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    logger.warn('worker %d died, received signal %s and code %s', worker.process.pid, signal, code);
  });

  cluster.on('online', function(worker) {
    logger.info('Worker %d forked', worker.process.pid);
  });
} else {
  serviceConfigurer.configure(config, express);
}
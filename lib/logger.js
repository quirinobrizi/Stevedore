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
exports.Credential = function(username, password) {

  this.username = username;
  this.password = password;

  this.getUsername = function() {
    return this.username;
  }
  this.getPassword = function() {
    return this.password;
  }
};

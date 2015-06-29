module.exports = {

  basic: function(credential, cb) {
    console.log("on authentication provider %j", credential);
    cb(null, credential.username === 'q' && credential.password === 'q');
  }
};
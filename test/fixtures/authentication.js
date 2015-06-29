module.exports = {

  basic: function(credential, cb) {
    cb(null, credential.username === 'test' && credential.password === 'stevedore');
  }
};
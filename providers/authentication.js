module.exports = {

  basic: function(credential, cb) {
    console.log("on authentication provider %j", credential);
    cb(null, credential.username === 'q' && credential.password === 'q');
  },
  clientCertificate: function(certificate, cb) {
    console.log("on authentication provider %j", certificate);
    cb(null, true);
  }
};

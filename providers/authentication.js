module.exports = {

  basic: function(credential) {
    console.log("on authentication provider %j", credential);
    return credential.username === 'q' && credential.password === 'q';
  }
};

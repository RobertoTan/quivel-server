//++++++++++++++++++++
//+ SACSConfig.js    +
//++++++++++++++++++++
var crypto = require('crypto'),
    config = require('./config.js'),
    algorithm = 'aes-256-ctr',
    password = 'abcdbzzzzakuku';

module.exports = {
  "environment" : "https://api.test.sabre.com",
  "userId" : config['SABRE_USER'],
  "group" : config['SABRE_GROUP'],
  "domain" : config['SABRE_DOMAIN'],
  "clientSecret" : config['SABRE_SECRET'],
  "formatVersion" : "V1",

  encrypt : function(text) {
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  },
  decrypt : function(text) {
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
}

'use strict';
var redis = require('redis');

module.exports = Memory;

function Memory(config, stuff) {
    var self = Object.create(Memory.prototype);
    self._config = config;
    self._logger = stuff.logger;
    self._sinopia_config = stuff.config;
    self.client = redis.createClient();
    return self
}

Memory.prototype.authenticate = function (user, password, done) {
    var self = this;

    self.client.get(user, function (err, real_password) {
      if (err) {return done(err, false);}

      if (!real_password || password !== real_password) {
        return done(true, false);
      }

      // authentication succeeded!
      // return all usergroups this user has access to;
      return done(null, [user])
    });

};

Memory.prototype.adduser = function (user, password, done) {
    var self = this;
    self.client.set(user, password, function(err, res) {
      if (err) {return done(err);}
      done(null, user);
    });

};

var request = require('request');
var url = require('url');
var inherits = require('inherits');
var EventPipeline = require('event-pipeline');

module.exports = Postal;

function Postal (opts) {
  EventPipeline.call(this);

  var self = this;

  self.host = opts.host;
  self.url = url.parse(self.host);
  self.key = opts.key;
}

inherits(Postal, EventPipeline);

Postal.prototype.request = function (method, slug, data, cb) {
  var self = this;

  self.url.path = slug;

  var req = {
    url : self.url
    , method : method
    , json : true
    , headers : {
      "X-Server-API-Key" : self.key
    }
    , body : data
  };

  request(req, function (err, res, body) {
    if (err) {
      return cb(err);
    }

    if (body.status !== 'success') {
      var err;

      if (body.data) {
        err = new Error(body.data.message);
        err.code = body.data.code;
      }
      else {
        err = new Error('Error processing request. Status: ' + body.status)
      }

      err.status = body.status;

      return cb(err);
    }

    return cb(null, body);
  });
};

Postal.prototype.send = function (email, cb) {
  var self = this;

  var request = {
    email : email
  };

  self.emit('send:before', request, function (err) {
    if (err) {
      return cb(err);
    }

    self.request('post', '/api/v1/send/message', email, function (err, result) {
      request.error = err;
      request.result = result;

      self.emit('send:after', request, function () {
        return cb(err, result);
      });
    });
  });
};

Postal.prototype.message = function (opt, cb) {
  var self = this;

  var request = {
    opt : opt
  };

  self.emit('message:before', request, function (err) {
    if (err) {
      return cb(err);
    }

    self.request('get', '/api/v1/message/message', opt, function (err, result) {
      request.error = err;
      request.result = result;

      self.emit('message:after', request, cb);
    });
  });
};

Postal.prototype.deliveries = function (opt, cb) {
  var self = this;

  var request = {
    opt : opt
  };

  self.emit('deliveries:before', request, function (err) {
    if (err) {
      return cb(err);
    }

    self.request('get', '/api/v1/message/deliveries', opt, function (err, result) {
      request.error = err;
      request.result = result;

      self.emit('deliveries:after', request, cb);
    });
  });
};

postal.io
---------

A simple client for [Postal](https://github.com/atech/postal/)

example
-------

```sh
var Postal = require('postal.io');

var postal = new Postal({
  host : 'https://postal.example.com'
  , key : 'Vi7Sy5dsy35X8x3frTxlZYHn'
});

postal.send({
  to : ['recipient@other-domain.com']
  , cc : []
  , bcc : []
  , from : 'test@postal.example.com'
  , sender : null
  , subject : 'this is the subject'
  , tag : 'this is some tag'
  , reply_to : null
  , plain_body : 'text body'
  , html_body : '<h2>html body</h2'
  , attachments : [] //array of attachments
  , headers  : {} //hash
  , bounce : null //true/false
}, function (err, result) {
  /*... stuff ...*/
});
```

api
---

* **new Postal(opts)** - _constructor function_
  * **opts.host** - _string_ - the url to the postal server
  * **opts.key** - _string_ - the API key from the postal server
* **postal.send(email, callback)** - send an email
  * ** email ** - _hash_ - see [postal docs](https://atech.github.io/postal-api/controllers/send/message.html) for options
  * ** callback(err, result) ** - _function_ - callback function called when complete

events
------

Events are provided by [event-pipeline](https://github.com/wankdanker/event-pipeline). It is required to call the callback function in the event handler in order to continue processing the email. If an error is passed to the callback function, then the email will not be sent.

* **postal.on('send:before', handler)**
  * **handler(req, callback)** - _function_ - event handler function
* **postal.on('send:after', handler)**
  * **handler(req, callback)** - _function_ - event handler function

juice
-----

Here is an example of using this module with [juice](https://github.com/Automattic/juice).

```js
var juice = require('juice');
var Postal = require('postal.io');

var postal = new Postal({ /* ... */ });

postal.on('send:before', function (req, cb) {
  if (!req.email.html_body) {
    return cb()
  }

  juice.juiceResources(req.email.html_body, {}, function (err, body) {
    req.email.html_body = body;

    return cb(err, req)
  });
});

postal.send(/* ... /*);
```

license
-------
MIT

/***************
 * DECLARATION
 ***************/

/** @type {object} */
var express = require('express');

/** @type {number} */
var port = process.env.PORT || 3001;

/** @type {object} */
var amqp = require('amqp');

/** @type {object} */
var uuid = require('node-uuid');

/** @type {string} */
var url;

/** @type {object} */
var implOpts;

/** @type {object} */
var conn;

/** @type {object} */
var queue;

/** @type {object} */
var exchange;



/***************************
 * Open RabbitMQ connection
 ***************************/
var url = process.env.CLOUDAMQP_URL || 'amqp://localhost';
var implOpts = {
    reconnect: true,
    reconnectBackoffStrategy: 'linear',
    reconnectBackoffTime: 500
};
var conn = amqp.createConnection({url: url}, implOpts);
var queue;
var exchange;

conn.on('ready', function () {
  exchange = conn.exchange('');
  queue = conn.queue('randl');
});



/*************************
 * Initialise REST server
 *************************/
var server = express();
server.use(express.bodyParser());



/**************************
 * Register API Middleware
 **************************/

server.post('/create', function (req, res, next) {

  var body = {
    description: req.body.description,
    checkedOut: false
  }

  var id = uuid.v4();

  exchange.publish(queue.name, {
    id: id,
    event: 'update',
    body: body
  });

  res.end(id);
});

server.post('/update', function (req, res, next) {

  exchange.publish(queue.name, {
    id: req.body.id,
    event: 'update',
    body: req.body
  });

  res.end();
});

server.post('/remove', function (req, res, next) {

  exchange.publish(queue.name, {
    id: req.body.id,
    event: 'remove',
    body: null
  });

  res.end();
});

server.post('/checkout', function (req, res, next) {

  exchange.publish(queue.name, {
    id: req.body.id,
    event: 'checkout',
    body: null
  });

  res.end();
});

server.post('/checkin', function (req, res, next) {

  exchange.publish(queue.name, {
    id: req.body.id,
    event: "checkin",
    body: null
  });

  res.end();
});

server.listen(port);
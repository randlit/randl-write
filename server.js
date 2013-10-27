var express = require( "express" );
var amqp = require( "amqp" );
var uuid = require( "node-uuid" );
var path = require( "path" );
var server = express();

var url = process.env.CLOUDAMQP_URL || "amqp://localhost";
var implOpts = {
    reconnect: true,
    reconnectBackoffStrategy: "linear",
    reconnectBackoffTime: 500,
};
var conn = amqp.createConnection( { url: url }, implOpts );
var queue;
var exchange;
conn.on( "ready", function () {
    exchange = conn.exchange( "" );
    queue = conn.queue( "randl", {}, function () {
        queue.subscribe( function ( msg ) { console.log( msg.body ) });
    });
})

server.use( express.bodyParser() );


// POST
server.post( "/create", function ( req, res, next ) {

    var id = uuid.v4();

    exchange.publish( queue.name, {
        id: id,
        type: "create",
        body: req.body
    });

    res.end( id );
});

server.post( "/remove", function ( req, res, next ) {

    exchange.publish( queue.name, {
        id: req.body.id,
        type: "remove"
    });

    res.end();
});

server.post( "/update", function ( req, res, next ) {

    exchange.publish( queue.name, {
        id: req.body.id,
        type: "update",
        body: req.body
    });

    res.end();
});

server.post( "/book", function ( req, res, next ) {

    exchange.publish( queue.name, {
        id: req.body.id,
        type: "book",
        body: req.body
    });

    res.end();
});

server.post( "/checkout", function ( req, res, next ) {

    exchange.publish( queue.name, {
        id: req.body.id,
        type: "checkout",
        body: req.body
    });

    res.end();
});

server.post( "/checkin", function ( req, res, next ) {

    exchange.publish( queue.name, {
        id: req.body.id,
        type: "checkin",
        body: req.body
    });

    res.end();
});

server.post( "/cancel", function ( req, res, next ) {

    exchange.publish( queue.name, {
        id: req.body.id,
        type: "cancel",
        body: req.body
    });

    res.end();
});

server.get( "*", function ( req, res, next ) {
    res.sendfile( path.join( __dirname, "index.html" ) );
});

server.listen( 3000 );
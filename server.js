var express         = require( "express" );
var amqp            = require( "amqp" );
var uuid            = require( "node-uuid" );
var path            = require( "path" );
var httpProxy       = require( "http-proxy" );
var routingProxy    = new httpProxy.RoutingProxy();

function proxy ( pattern, host, port ) {
    
    return function ( req, res, next ) {
        if ( req.url.match( pattern ) ) {
            routingProxy.proxyRequest( req, res, {
                host: host,
                port: port
            });
        } else {
            next();
        }
    }
}

var url = process.env.CLOUDAMQP_URL || "amqp://134.34.14.126";
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
        queue.subscribe( function ( msg ) { console.log( msg.body ) } );
    });
})

var server = express();
server.use( express.bodyParser() );
server.use( proxy( "/randl*", "134.34.14.126", 9200 ) );
server.use( "/assets", express.static( __dirname ) );


// POST
server.post( "/create", function ( req, res, next ) {

    var body = {
        description: req.body.description,
        checkedOut: false
    }

    var id = uuid.v4();

    exchange.publish( queue.name, {
        id: id,
        event: "update",
        body: body
    });

    res.end( id );
});

server.post( "/update", function ( req, res, next ) {

    exchange.publish( queue.name, {
        id: req.body.id,
        event: "update",
        body: req.body
    });

    res.end();
});

server.post( "/remove", function ( req, res, next ) {

    exchange.publish( queue.name, {
        id: req.body.id,
        event: "remove",
        body: null
    });

    res.end();
});


server.post( "/checkout", function ( req, res, next ) {

    exchange.publish( queue.name, {
        id: req.body.id,
        event: "checkout",
        body: null
    });

    res.end();
});

server.post( "/checkin", function ( req, res, next ) {

    exchange.publish( queue.name, {
        id: req.body.id,
        event: "checkin",
        body: null
    });

    res.end();
});


server.get( "/", function ( req, res, next ) {
    res.sendfile( path.join( __dirname, "index.html" ) );
});

server.get( "/dashboard", function ( req, res, next ) {
    res.sendfile( path.join( __dirname, "dashboard.html" ) );
});

server.listen( 3000 );
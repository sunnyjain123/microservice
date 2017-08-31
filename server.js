/**
	* Module Dependencies
*/
var config 		   = require('./config/config'); // Config File
var restify 	   = require('restify'); // Required to create server and nodejs framework
var mongoose 	   = require('mongoose'); // Required to access mongodb
var restifyPlugins = require('restify-plugins'); // Plugins of restify
var winston    	   = require('winston'); // Winston for logging


/**
	* Initialize Server
*/
var server = restify.createServer({ // Create server with restify
	name: config.name,
	version: config.version,
});

/**
	* Middleware
*/
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.bodyParser({}));

// CORS set on all request
server.use(
	function crossOrigin(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		return next();
	}
);

/**
	* Start Server, Connect to DB & Require Routes
*/
server.listen(config.port, () => {
	// establish connection to mongodb
	mongoose.Promise = global.Promise;
	mongoose.connect(config.db.uri, { useMongoClient: true });

	var db = mongoose.connection;

	db.on('error', (err) => {
		winston.error(err);
		process.exit(1);
	});

	db.once('open', () => {
		require('./server/routes')(server);
		winston.info(`Server is listening on port ${config.port}`);
	});
});

// Export for use in test server
module.exports = server;
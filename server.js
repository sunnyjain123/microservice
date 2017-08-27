/**
	* Module Dependencies
*/
var config = require('./config/config');
var restify = require('restify');
var mongoose = require('mongoose');
var restifyPlugins = require('restify-plugins');

/**
	* Initialize Server
*/
var server = restify.createServer({
	name: config.name,
	version: config.version,
});

/**
	* Middleware
*/
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.bodyParser({}));

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
		console.error(err);
		process.exit(1);
	});

	db.once('open', () => {
		require('./server/routes')(server);
		console.log(`Server is listening on port ${config.port}`);
	});
});

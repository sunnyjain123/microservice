module.exports = function(server) {

	// inclue all services
	var userService = require('./services/user');
	var patchService = require('./services/patch');

	server.post('/api/1.0/generateToken', userService.generateToken);

	server.post('/api/1.0/jsonPatch', patchService.jsonPatch);
}
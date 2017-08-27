module.exports = function(server) {

	// inclue all services
	var userService = require('./services/user');

	server.post('/api/1.0/generateToken', userService.generateToken);
}
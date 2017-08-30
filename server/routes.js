module.exports = function(server) {

	// inclue all services
	var userService  = require('./services/user'); // Access user service used to generate token
	var patchService = require('./services/patch'); // Access patch service used to patch given data
	var imageService = require('./services/imageSize'); // Access imageSize service used to resize given image

	server.post('/api/1.0/generateToken', userService.generateToken); // Route to generate token
	server.post('/api/1.0/jsonPatch', patchService.jsonPatch); // Route to patch given data
	server.post('/api/1.0/imageSizeChange', imageService.imageSizeChange); // Route to resize given image
}
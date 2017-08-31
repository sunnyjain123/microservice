module.exports = function(server) {

	// inclue all services
	var swaggerJSDoc = require('swagger-jsdoc'); // Swagger JsDoc to generate documentation
	var userService  = require('./services/user'); // Access user service used to generate token
	var patchService = require('./services/patch'); // Access patch service used to patch given data
	var imageService = require('./services/imageSize'); // Access imageSize service used to resize given image

	// Definition of application in swagger
	var swaggerDefinition = {
		info: {
			title: 'Microservice app',
			version: '1.0.0',
			description: 'It is a microservice to authenticate user and generate access token to authenticate jsonpatch and image resizing apis',
		},
		host: 'localhost:3000',
	};

	// options for swagger jsdoc 
	var options = {
		swaggerDefinition: swaggerDefinition, // swagger definition
		apis: ['./server/services/*.js', './server/models/*.js', './config/*.js'], // path where API specification are written
	};

	// initialize swaggerJSDoc
	var swaggerSpec = swaggerJSDoc(options);

	server.post('/api/1.0/generateToken', userService.generateToken); // Route to generate token
	server.post('/api/1.0/jsonPatch', patchService.jsonPatch); // Route to patch given data
	server.post('/api/1.0/imageSizeChange', imageService.imageSizeChange); // Route to resize given image
	server.get('/swagger', function(req, res) { // Route to get swagger specification JSON
		res.setHeader('Content-Type', 'application/json');
		res.send(swaggerSpec);
	});
}
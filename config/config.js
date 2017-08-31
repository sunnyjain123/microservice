/**
	* @swagger
	*   Config File:
	*     Description: Config file to use predefined values
	*     parameters:
	*       - name: name
	*         description: Name of the application
	*       - name: env
	*         description: Environment of the application
	*       - name: port
	*         description: Port on which application will run
	*       - name: db
	*         description: MongoDB Database of application
	*       - name: secret
	*         description: Secret of JWT Token generation
*/

module.exports = {
	name: 'microservice', // Name of server
	env: process.env.NODE_ENV || 'development', // Environment of server
	port: process.env.PORT || 3000, // Port of server
	db: { // DB url of server
		uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/microservice',
	},
	secret : 'jwtSecretKey', // Secret used for JWT Token
};
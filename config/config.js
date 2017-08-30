module.exports = {
	name: 'microservice', // Name of server
	env: process.env.NODE_ENV || 'development', // Environment of server
	port: process.env.PORT || 3000, // Port of server
	base_url: process.env.BASE_URL || 'http://localhost:3000', // URL of service
	db: { // DB url of server
		uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/microservice',
	},
	secret : 'jwtSecretKey', // Secret used for JWT Token
};
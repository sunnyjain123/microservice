var mongoose = require('mongoose'); // Requied to access mongodb
var Schema   = mongoose.Schema; // To create schema

/**
	* @swagger
	*   User Schema:
	*     Description: User schema contains definition of a user object
	*     parameters:
	*       - name: Username
	*         type: String
	*         description: username of the user
	*         required: true
	*       - name: password
	*         type: String
	*         description: password of the user
	*         required: true
	*       - name: token
	*         type: String
	*         description: token of the user Generated after authentication using jwt
	*         required: true
	*       - name: expires_at
	*         type: Date
	*         description: Expiry data of the current token set to 3 hours after generation of token
	*         required: true
*/

var usersSchema = new Schema({ // Schema of user
	username : {
		type : String,
		default : '' // name of user
	},
	password : {
		type : String,
		default : '' // Password of user
	},
	token : {
		type : String,
		default : '' // Token of user
	},
	expires_at : {
		type : Date,
		default : new Date() // Expirey Date of token
	}
});

module.exports = mongoose.model('user', usersSchema);
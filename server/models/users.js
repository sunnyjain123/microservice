var mongoose = require('mongoose'); // Requied to access mongodb
var Schema   = mongoose.Schema; // To create schema

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
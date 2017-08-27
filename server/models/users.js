var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var usersSchema = new Schema({
	username : {
		type : String,
		default : '' // title of product
	},
	password : {
		type : String,
		default : ''
	},
	token : {
		type : String,
		default : ''
	},
	expires_at : {
		type : Date,
		default : new Date()
	}
});


mongoose.model('user', usersSchema);


var mongoose = require('mongoose');

require('./../models/users')

var user = mongoose.model('user');

var generateToken = function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	// return res.send('user');
}

module.exports = {
	generateToken : generateToken
}
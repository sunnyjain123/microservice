var mongoose = require('mongoose');
var jwt    = require('jsonwebtoken');
var config = require('./../../config/config');

require('./../models/users')

var user = mongoose.model('user');

var generateToken = function(req, res){
	if(typeof req.body == 'string'){
		return res.json({ success: false, message: 'Something went wrong. Please send data as an object.' });
	}
	
	var newUser = {
		username : req.body.username,
		password : req.body.password
	}

	var token = jwt.sign(newUser, config.secret, {
		expiresIn: 180000 // expires in 3 hours
	});

	var data_send = {
		token : token,
		expires_at : new Date(new Date().getTime() + 180000)
	}

	user.findOneAndUpdate({
		username : req.body.username,
		password : req.body.password
	}, {
		$set : {
			username : req.body.username,
			password : req.body.password,
			token : token,
			expires_at : data_send.expires_at
		}
	}, {
		upsert : true
	}, function(err, savedUser){
		if(err){
			return res.json({ success: false, message: 'Something went wrong. Please try again.' });
		}else{
			return res.json(data_send);
		}
	})
}

module.exports = {
	generateToken : generateToken
}
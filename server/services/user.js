var mongoose = require('mongoose'); // Required to run commands on mongodb
var jwt    	 = require('jsonwebtoken'); // Required to generate JWT Token
var config 	 = require('./../../config/config'); // To access config file
var user 	 = require('./../models/users'); // Required to access user schema modal

// Function to generate token and return
var generateToken = function(req, res){
	// Check if data if coming in right format
	if(typeof req.body == 'string'){
		return res.json({ success: false, message: 'Something went wrong. Please send data as an object.' });
	}

	// Check if username or password is present or not
	if(!req.body.username || !req.body.password){
		return res.json({ success: false, message: 'Authetication failed. Please check username or password.' });
	}
	
	// Create a new user object
	var newUser = {
		username : req.body.username,
		password : req.body.password
	}

	// Generate JWT Token
	jwt.sign(newUser, config.secret, {
		expiresIn: '3h' // expires in 3 hours
	}, function(err, token) {
		if(err){
			return res.json({ success: false, message: 'Something went wrong. Please try again.' });
		}else{
			// Token expire time
			var expires_at = new Date(new Date().getTime() + 10800000);

			// Find and update user or create a new user
			user.findOneAndUpdate({
				username : req.body.username,
				password : req.body.password
			}, {
				$set : {
					username : req.body.username,
					password : req.body.password,
					token : token,
					expires_at : expires_at
				}
			}, {
				upsert : true
			}, function(err, savedUser){
				if(err){
					return res.json({ success: false, message: 'Something went wrong. Please try again.' }); // Return if user not saved or updated
				}else{
					return res.json({token : token, expires_at : expires_at}); // Return if user saved or updated
				}
			})
		}
	});
}

module.exports = {
	generateToken : generateToken
}
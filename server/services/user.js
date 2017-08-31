var mongoose = require('mongoose'); // Required to run commands on mongodb
var jwt    	 = require('jsonwebtoken'); // Required to generate JWT Token
var config 	 = require('./../../config/config'); // To access config file
var user 	 = require('./../models/users'); // Required to access user schema modal
var authLog   = require('./../../logger').auth; // Required to access logs for authentication api

/**
	* @swagger
	*   Authentication:
	*     Url: /api/1.0/generateToken
	*     Description: Api to authenticate user and generate token
	*     Type: post
	*     produces:
	*       - application/json
	*     parameters:
	*       - name: username
	*         type: String
	*         description: username of the user
	*         in: request body
	*         required: true
	*         schema:
	*           $ref: '#/models/users'
	*       - name: password
	*         type: String
	*         description: password of the user
	*         in: request body
	*         required: true
	*         schema:
	*           $ref: '#/models/users'
	*     responses:
	*       200:
	*         description: Returns token and expiry time
	*         schema:
	*           $ref: '#/models/users'
*/

// Function to generate token and return
var generateToken = function(req, res){
	authLog.info('API : /api/1.0/generateToken ' + new Date());
	// Check if data if coming in right format
	if(typeof req.body == 'string'){
		return res.json({ success: false, message: 'Something went wrong. Please send data as an object.' });
	}

	// Check if username or password is present or not
	if(!req.body.username || !req.body.password){
		authLog.error({ success: false, message: 'Authetication failed. Please check username or password.' })
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
			authLog.error(err);
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
					authLog.info({token : token, expires_at : expires_at});
					return res.json({token : token, expires_at : expires_at}); // Return if user saved or updated
				}
			})
		}
	});
}

var verifyToken = function(token, callback){
	jwt.verify(token, config.secret, function(err, decoded) {
		if (err) { // If wrong token provided
			callback({ success: false, message: 'Failed to authenticate token. Please login again or try after some time.' });
		} else {
			// Find if user is present or not
			user.findOne({username : decoded.username, password : decoded.password}, function(errUser, resultUser){
				if(err){ // If something went wrong in finding user
					callback({ success: false, message: 'Failed to authenticate token. Please login again or try after some time.' });
				}else if(!resultUser){ // If user not found
					callback({ success: false, message: 'Failed to authenticate token. Please login again or try after some time.' });
				}else{
					callback(null, decoded);
				}
			});
		}
	})
}

module.exports = {
	generateToken : generateToken,
	verifyToken   : verifyToken
}
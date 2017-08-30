var mongoose  = require('mongoose'); // Required to run commands on mongodb
var jwt    	  = require('jsonwebtoken'); // Required to generate JWT Token
var config 	  = require('./../../config/config'); // To access config file
var jsonpatch = require('json-patch'); // Required to patch json
var user 	  = require('./../models/users'); // Required to access user schema modal


// Function to generate patched json and return it
var jsonPatch = function(req, res){
	if(!req.headers.token){ // Check if token is provided or not.
		return res.json({ success: false, message: 'Something went wrong. Please provide access token.' });
	}

	// Check if data is provided or not
	if(!req.body.obj || !req.body.patch){
		return res.json({ success: false, message: 'Something went wrong. Please provide valid Data.' });
	}

	// Try to check if code generates an error
	try{
		var obj = req.body.obj; // Object to patch
		var patch = req.body.patch; // Object with patch operations
		if(typeof req.body.obj == 'string'){ // If Object is provideed as an string
			obj = JSON.parse(req.body.obj);
		}
		
		if(typeof req.body.patch == 'string'){ // If patch is provideed as an string
			patch = JSON.parse(req.body.patch);
		}

		// Verify Provided JWT Token is valid or not.
		jwt.verify(req.headers.token, config.secret, function(err, decoded) {      
			if (err) { // If wrong token provided
				return res.json({ success: false, message: 'Failed to authenticate token. Please login again or try after some time.' });
			} else {
				// Find if user is present or not
				user.findOne({username : decoded.username, password : decoded.password}, function(errUser, resultUser){
					if(err){ // If something went wrong in finding user
						return res.json({ success: false, message: 'Failed to authenticate token. Please login again or try after some time.' });
					}else if(!resultUser){ // If user not found
						return res.json({ success: false, message: 'Failed to authenticate token. Please login again or try after some time.' });
					}else{
						try{ // Try to check if json is patched perfectly or not
							var patchObject = jsonpatch.apply(obj, patch);
							return res.json(patchObject);
						}catch(e){ // If provided data is not correct
							return res.json({ success: false, message: 'Something went wrong. Please provide valid Data.' });
						}
					}
				})
			}
		});
	}catch(err){ // If function throws an error.
		return res.json({ success: false, message: 'Something went wrong. Please provide valid Data.' });
	}
}

module.exports = {
	jsonPatch : jsonPatch
}
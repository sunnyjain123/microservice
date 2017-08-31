var mongoose    = require('mongoose'); // Required to run commands on mongodb
var jwt    	    = require('jsonwebtoken'); // Required to generate JWT Token
var config 	    = require('./../../config/config'); // To access config file
var jsonpatch   = require('json-patch'); // Required to patch json
var user 	    = require('./../models/users'); // Required to access user schema modal
var winston     = require('winston'); // Winston for logging
var userService = require('./user'); // Required to access token verify function

/**
	* @swagger
	*   JSON patching:
	*     Url: /api/1.0/jsonPatch
	*     Description: Api to patch given data on the basis of gic=ven patch operations
	*     Type: post
	*     produces:
	*       - application/json
	*     parameters:
	*       - name: obj
	*         type: Object
	*         description: Object data to patch 
	*         in: request body
	*         required: true
	*       - name: patch
	*         type: Array
	*         description: Contains patch operations to perform on given object
	*         in: request body
	*         required: true
	*       - name: token
	*         type: String
	*         description: Token to verify user access
	*         used : Image to resize
	*         in: request header
	*         required: true
	*     responses:
	*       200:
	*         description: Patched data
*/

// Function to generate patched json and return it
var jsonPatch = function(req, res){
	winston.info('API : /api/1.0/jsonPatch ' + new Date());
	if(!req.headers.token){ // Check if token is provided or not.
		return res.json({ success: false, message: 'Something went wrong. Please provide access token.' });
	}

	// Check if data is provided or not
	if(req.body){
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
			userService.verifyToken(req.headers.token, function(err, result){
				if(err){ // If Token is not valid send error
					return res.json(err);
				}else{
					try{ // Try to check if json is patched perfectly or not
						var patchObject = jsonpatch.apply(obj, patch);
						winston.info(patchObject);
						return res.json(patchObject);
					}catch(e){ // If provided data is not correct
						return res.json({ success: false, message: 'Something went wrong. Please provide valid Data.' });
					}
				}
			});
		}catch(err){ // If function throws an error.
			return res.json({ success: false, message: 'Something went wrong. Please provide valid Data.' });
		}
	}else{ // If data is not provided
		return res.json({ success: false, message: 'Something went wrong. Please provide valid Data.' });
	}
}

module.exports = {
	jsonPatch : jsonPatch
}
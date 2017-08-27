var mongoose = require('mongoose');
var jwt    = require('jsonwebtoken');
var config = require('./../../config/config');
var jsonpatch = require('json-patch');

require('./../models/users')

var user = mongoose.model('user');

var jsonPatch = function(req, res){
	if(!req.body.obj){
		return res.json({ success: false, message: 'Please provide a valid object ot patch.' });
	}

	if(!req.body.patch){
		return res.json({ success: false, message: 'Please provide a valid patch data.' });
	}

	try{
		var obj = JSON.parse(req.body.obj);
		var patch = JSON.parse(req.body.patch);

		jwt.verify(req.headers.token, config.secret, function(err, decoded) {      
			if (err) {
				return res.json({ success: err, message: 'Failed to authenticate token. Please login again or try after some time. 1' });
			} else {
				user.findOne({username : decoded.username, password : decoded.password}, function(errUser, resultUser){
					if(err){
						return res.json({ success: err, message: 'Failed to authenticate token. Please login again or try after some time. 2' });
					}else if(!resultUser){
						return res.json({ success: err, message: 'Failed to authenticate token. Please login again or try after some time. 3' });
					}else{
						try{
							var patchObject = jsonpatch.apply(obj, patch);
							return res.json(patchObject);
						}catch(e){
							return res.json({ success: false, message: 'Something went wrong. Please provide a valid patch data.' });
						}
					}
				})
			}
		});
	}catch(err){
		return res.json({ success: false, message: 'Something went wrong. Please provide a valid patch Data.' });
	}
}

module.exports = {
	jsonPatch : jsonPatch
}
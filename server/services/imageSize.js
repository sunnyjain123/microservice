var mongoose = require('mongoose');
var jwt    = require('jsonwebtoken');
var config = require('./../../config/config');

require('./../models/users')

var user = mongoose.model('user');

var imageSizeChange = function(req, res){
	if(!req.headers.token){
		return res.json({ success: false, message: 'Please provide access token.' });
	}
	
	if(!req.body.image){
		return res.json({ success: false, message: 'Please provide a image url to resize.' });
	}

	try{
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
						return res.json(decoded);
					}
				})
			}
		});
	}catch(err){
		return res.json({ success: false, message: 'Something went wrong. Please provide a valid image Data.' });
	}
}


module.exports = {
	imageSizeChange : imageSizeChange
}
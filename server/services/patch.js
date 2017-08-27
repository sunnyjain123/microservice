var mongoose = require('mongoose');
var jwt    = require('jsonwebtoken');
var config = require('./../../config/config');

require('./../models/users')

var user = mongoose.model('user');

var jsonPatch = function(req, res){
	jwt.verify(req.headers.token, config.secret, function(err, decoded) {      
		if (err) {
			return res.jsonp({ success: err, message: 'Failed to authenticate token.' });
		} else {
			return res.jsonp(decoded);
		}
	});
}

module.exports = {
	jsonPatch : jsonPatch
}
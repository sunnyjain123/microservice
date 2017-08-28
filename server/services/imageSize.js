var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var lwip = require('lwip');
var fs = require('fs');
var request = require('request');
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
		var imageName = req.body.image.split('/')[req.body.image.split('/').length - 1];
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
						resizeImage(req.body.image, imageName, function(err, resp){
							if(err){
								return res.json(err);
							}else{
								return res.json(resp);
							}
						})
					}
				})
			}
		});
	}catch(err){
		return res.json({ success: false, message: 'Something went wrong. Please provide a valid image Data.' });
	}
}

var resizeImage = function(image, imageName, callback){
	download(image, './download/'+ imageName, function(err){
		if(err){
			console.log(err);
			callback({success : false, message : 'Something went wrong. please check if image is private or url is correct1.'})
		}else{
			lwip.open('./download/'+ imageName, function(err, image){
				if(err){
					console.log(err);
					callback({success : false, message : 'Something went wrong. please check if image is private or url is correct2.'});
				}else{
					image.resize(50, 50, function(err, image){
						if(err){
							callback({success : false, message : 'Something went wrong. please try again.'});
						}else{
							image.writeFile('./resize/'+ imageName, function(err){
								if(err){
									callback({success : false, message : 'Something went wrong. please try again.'});
								}else{
									callback(null, {success : true, url : config.directoryPath + '/resize/'+ imageName});
								}
							});
						}
					});
				}
			});
		}
	});
}

var download = function(uri, filename, callback){
	request.head(uri, function(err, res, body){
		if(err){
			callback(err);
		}else{
			request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		}
	});
};

module.exports = {
	imageSizeChange : imageSizeChange
}
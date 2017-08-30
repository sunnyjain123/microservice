var mongoose   = require('mongoose'); // Required to run commands on mongodb
var jwt    	   = require('jsonwebtoken'); // Required to generate JWT Token
var config 	   = require('./../../config/config'); // To access config file
var lwip 	   = require('lwip'); // Required to resize image
var fs 		   = require('fs'); // File System to read files
var request    = require('request'); // Request used to Get image
var winston    = require('winston'); // Winston for logging
var cloudinary = require('cloudinary'); // Required to upload file
var user 	   = require('./../models/users'); // Required to access user schema modal

cloudinary.config({ // Configuration of cloudinary
	cloud_name: 'djfe3xi4i', 
	api_key: '318366829814631', 
	api_secret: '8gKTl-HQ1eESSUDKZ6EyXO6ROxU' 
});

// Function to resize image and return it
var imageSizeChange = function(req, res){
	if(!req.headers.token){ // Check if token is provided or not.
		return res.json({ success: false, message: 'Something went wrong. Please provide access token.' });
	}

	// Check if data is provided or not
	if(req.body){
		if(!req.body.image){ // Check if image is provided or not.
			return res.json({ success: false, message: 'Something went wrong. Please provide a image url to resize.' });
		}

		// Try to check if code generates an error
		try{
			// Name of the image
			var imageName = req.body.image.split('/')[req.body.image.split('/').length - 1];

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
							// Resize the image
							resizeImage(req.body.image, imageName, function(err, resp){
								if(err){ // If problem in resizing image
									return res.json(err);
								}else{
									winston.info(resp);
									return res.json(resp);
								}
							})
						}
					})
				}
			});
		}catch(err){ // If function throws an error.
			return res.json({ success: false, message: 'Something went wrong. Please provide a valid image Data.' });
		}
	}else{
		return res.json({ success: false, message: 'Something went wrong. Please provide a valid image Data.' });
	}
}

// Function to resize image
var resizeImage = function(image, imageName, callback){
	// Download and save image
	download(image, './download/'+ imageName, function(err){
		if(err){ // If something went wrong in downloading file
			callback({success : false, message : 'Something went wrong. please check if image is private or url is correct.'})
		}else{
			// Open image to resize
			lwip.open('./download/'+ imageName, function(err, image){
				if(err){
					callback({success : false, message : 'Something went wrong. please check if image is private or url is correct.'});
				}else{
					// Resize image
					image.resize(50, 50, function(err, image){
						if(err){
							callback({success : false, message : 'Something went wrong. please try again.'});
						}else{
							// Write file in system
							image.writeFile('./download/50x50_'+ imageName, function(err){
								if(err){
									callback({success : false, message : 'Something went wrong. please try again.'});
								}else{
									// Upload image to cloudinary
									cloudinary.uploader.upload('./download/50x50_'+ imageName, function(result) { 
										if(result){ // If image uploaded successfully
											callback(null, {success : true, url : result.secure_url});
										}else{ // If image not uploaded successfully
											callback({success : false, message : 'Something went wrong. please try again.'});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
}

// Function to download image
var download = function(uri, filename, callback){
	// Get Image
	request.head(uri, function(err, res, body){
		if(err){
			callback(err);
		}else{
			// Check if download folder exists
			fs.stat("./download/", function (err, stats){
				if (err) { // If error create folder
					fs.mkdirSync('./download');
				}else{
					if (!stats) { // If not folder stats create folder
						// This isn't a directory!
						fs.mkdirSync('./download');
					}else{
						if(!stats.isDirectory()){ // If not type folder create folder
							fs.mkdirSync('./download');
						}
					}
				}
				// get image and save it
				request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
			});
		}
	});
};

module.exports = {
	imageSizeChange : imageSizeChange
}
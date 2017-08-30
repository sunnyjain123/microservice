var chai = require('chai');
var request = require('request');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../server');

chai.use(chaiHttp);

var token = ''

// Token generation test Cases
describe('POST /api/1.0/generateToken', function() {
	// Success case to check if api returns correct if provided correct data
	it('Should return Token with username and password', function(done) {
		var user = { // Object to send
			username: "Sunny",
			password: "Sunny"
		}
		// Making a request to api
		chai.request(server)
			.post('/api/1.0/generateToken')
			.send(user)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('token'); // Returned object must have a token key
				res.body.should.have.property('expires_at'); // Returned object must have a expired key
				token = res.body.token; // set token for next apis
				done();
			});
	});

	// Check if password not provided
	it('Should return success false no password', function(done) {
		var user = { // Object to send
			username: "Sunny"
		}
		// Making a request to api
		chai.request(server)
			.post('/api/1.0/generateToken')
			.send(user)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('success').eql(false); // Returned object must have a success key with value false
				res.body.should.have.property('message').eql('Authetication failed. Please check username or password.'); // Returned object must have a message key
				done();
			});
	});

	// Check if username not provided
	it('Should return success false no username', function(done) {
		var user = { // Object to send
			password: "Sunny"
		}
		chai.request(server)
			.post('/api/1.0/generateToken')
			.send(user)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('success').eql(false); // Returned object must have a success key with value false
				res.body.should.have.property('message').eql('Authetication failed. Please check username or password.'); // Returned object must have a message key
				done();
			});
	});

	// Check if correct type of data is not provided
	it('Should return success false no correct type of data', function(done) {
		var user = JSON.stringify('{username: "Sunny", password: "Sunny"}'); // data to send
		chai.request(server)
			.post('/api/1.0/generateToken')
			.send(user)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('success').eql(false); // Returned object must have a success key with value false
				res.body.should.have.property('message').eql('Authetication failed. Please check username or password.'); // Returned object must have a message key
				done();
			});
	});
});

// JSON Patch test cases
describe('POST /api/1.0/jsonPatch', function() {
	// Test success test
	it('Should return patched object', function(done) {
		var json = { // Data to send
			obj : {
				"baz": "qux",
				"foo": "bar" 
			},
			patch : [{
				"op": "replace", "path": "/baz", "value": "boo"
			},{
				"op": "add", "path": "/hello", "value": "world"
			},{
				"op": "remove", "path": "/foo"
			}]
		}

		// Making a request to api
		chai.request(server)
			.post('/api/1.0/jsonPatch')
			.set('token', token)
			.send(json)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('baz').equal('boo'); // Rrturned data must contain baz key with vakue boo
				res.body.should.have.property('hello').equal('world'); // Rrturned data must contain hello key with vakue world
				done();
			});
	});

	// Check if patch orerations not send
	it('Should return not valid json patch', function(done) {
		var json = { // Data to send
			obj : {
				"baz": "qux",
				"foo": "bar" 
			}
		}

		// Making a request to api
		chai.request(server)
			.post('/api/1.0/jsonPatch')
			.set('token', token)
			.send(json)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('success').eql(false); // Rrturned data must contain success key with vakue false
				res.body.should.have.property('message').eql('Something went wrong. Please provide valid Data.'); // Rrturned data must contain message key
				done();
			});
	});

	// Check if object to patch not send
	it('Should return not valid json object', function(done) {
		var json = { // Data to send
			patch : [{
				"op": "replace", "path": "/baz", "value": "boo"
			},{
				"op": "add", "path": "/hello", "value": ["world"]
			},{
				"op": "remove", "path": "/foo"
			}]
		}

		// Making a request to api
		chai.request(server)
			.post('/api/1.0/jsonPatch')
			.set('token', token)
			.send(json)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('success').eql(false); // Rrturned data must contain success key with vakue false
				res.body.should.have.property('message').eql('Something went wrong. Please provide valid Data.'); // Rrturned data must contain message key
				done();
			});
	});

	// Check if token not provided
	it('Should return no token found', function(done) {
		var json = { // Data to send
			obj : {
				"baz": "qux",
				"foo": "bar" 
			},
			patch : [{
				"op": "replace", "path": "/baz", "value": "boo"
			},{
				"op": "add", "path": "/hello", "value": ["world"]
			},{
				"op": "remove", "path": "/foo"
			}]
		}

		// Making a request to api
		chai.request(server)
			.post('/api/1.0/jsonPatch')
			.send(json)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('success').eql(false); // Rrturned data must contain success key with vakue false
				res.body.should.have.property('message').eql('Something went wrong. Please provide access token.'); // Rrturned data must contain message key
				done();
			});
	});

	// Check if wrong token provided
	it('Should return Please login again', function(done) {
		var json = { // Data to send
			obj : {
				"baz": "qux",
				"foo": "bar" 
			},
			patch : [{
				"op": "replace", "path": "/baz", "value": "boo"
			},{
				"op": "add", "path": "/hello", "value": ["world"]
			},{
				"op": "remove", "path": "/foo"
			}]
		}

		// Making a request to api
		chai.request(server)
			.post('/api/1.0/jsonPatch')
			.set('token', token + 'as')
			.send(json)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('success').eql(false); // Rrturned data must contain success key with vakue false
				res.body.should.have.property('message').eql('Failed to authenticate token. Please login again or try after some time.'); // Rrturned data must contain message key
				done();
			});
	});

	// If patch operation data is corrupt
	it('Should return wrong patch data', function(done) {
		var json = { // Data to send
			obj : {
				"baz": "qux",
				"foo": "bar" 
			},
			patch : [{
				"o": "replace", "path": "/baz", "value": "boo"
			},{
				"op": "add", "path": "/hello", "value": ["world"]
			},{
				"op": "remove", "path": "/foo"
			}]
		}

		// Making a request to api
		chai.request(server)
			.post('/api/1.0/jsonPatch')
			.set('token', token)
			.send(json)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('success').eql(false); // Rrturned data must contain success key with vakue false
				res.body.should.have.property('message').eql('Something went wrong. Please provide valid Data.'); // Rrturned data must contain message key
				done();
			});
	});

	// If patch operation data type is not correct
	it('Should return not valid data', function(done) {
		var json = { // Data to send
			obj : {
				"baz": "qux",
				"foo": "bar" 
			},
			patch : 'abc'
		}

		// Making a request to api
		chai.request(server)
			.post('/api/1.0/jsonPatch')
			.set('token', token)
			.send(json)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('success').eql(false); // Rrturned data must contain success key with vakue false
				res.body.should.have.property('message').eql('Something went wrong. Please provide valid Data.'); // Rrturned data must contain message key
				done();
			});
	});

	// If data to patch is corrupt
	it('Should return not valid data object', function(done) {
		var json = { // Data to send
			obj : 'ab',
			patch : [{
				"o": "replace", "path": "/baz", "value": "boo"
			},{
				"op": "add", "path": "/hello", "value": ["world"]
			},{
				"op": "remove", "path": "/foo"
			}]
		}

		// Making a request to api
		chai.request(server)
			.post('/api/1.0/jsonPatch')
			.set('token', token)
			.send(json)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('success').eql(false); // Rrturned data must contain success key with vakue false
				res.body.should.have.property('message').eql('Something went wrong. Please provide valid Data.'); // Rrturned data must contain message key
				done();
			});
	});

	// If data is not prpvided
	it('Should return no data provided', function(done) {
		// Making a request to api
		chai.request(server)
			.post('/api/1.0/jsonPatch')
			.set('token', token)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('success').eql(false); // Rrturned data must contain success key with vakue false
				res.body.should.have.property('message').eql('Something went wrong. Please provide valid Data.'); // Rrturned data must contain message key
				done();
			});
	});
});


// Image resize test cases
describe('POST /api/1.0/imageSizeChange', function() {
	// If data provideed is correct
	it('Should return resized image', function(done) {
		var image = { // Data to send
			image : 'https://s3.amazonaws.com/silverpushcdn/320x50_Datawind-Calling-Tablet.jpg'
		}

		// Making a request to api
		chai.request(server)
			.post('/api/1.0/imageSizeChange')
			.set('token', token)
			.send(image)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('success').eql(true); // Rrturned data must contain success key with vakue true
				res.body.should.have.property('url'); // Rrturned data must contain url key
				done();
			});
	});

	// If image is not provided
	it('Should return no image found', function(done) {
		var image = { // Data to send
			image : ''
		}

		// Making a request to api
		chai.request(server)
			.post('/api/1.0/imageSizeChange')
			.set('token', token)
			.send(image)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('success').eql(false); // Rrturned data must contain success key with vakue false
				res.body.should.have.property('message').eql('Something went wrong. Please provide a image url to resize.'); // Rrturned data must contain message key
				done();
			});
	});

	// If image is corrupt
	it('Should return invalid image', function(done) {
		var image = { // Data to send
			image : 'https://s3.amazonaws.com/silverpushcdn/320x50_Datawind-Calling-Talet.jpg'
		}

		// Making a request to api
		chai.request(server)
			.post('/api/1.0/imageSizeChange')
			.set('token', token)
			.send(image)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('success').eql(false); // Rrturned data must contain success key with vakue false
				res.body.should.have.property('message').eql('Something went wrong. please check if image is private or url is correct.'); // Rrturned data must contain message key
				done();
			});
	});

	// If token is not provided
	it('Should return no token found', function(done) {
		var image = { // Data to send
			image : 'https://s3.amazonaws.com/silverpushcdn/320x50_Datawind-Calling-Tablet.jpg'
		}

		// Making a request to api
		chai.request(server)
			.post('/api/1.0/imageSizeChange')
			.send(image)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('success').eql(false); // Rrturned data must contain success key with vakue false
				res.body.should.have.property('message').eql('Something went wrong. Please provide access token.'); // Rrturned data must contain message key
				done();
			});
	});

	// If token is not correct
	it('Should return Please login again', function(done) {
		var image = { // Data to send
			image : 'https://s3.amazonaws.com/silverpushcdn/320x50_Datawind-Calling-Tablet.jpg'
		}

		chai.request(server)
			.post('/api/1.0/imageSizeChange')
			.set('token', token + 'as')
			.send(image)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('success').eql(false); // Rrturned data must contain success key with vakue false
				res.body.should.have.property('message').eql('Failed to authenticate token. Please login again or try after some time.'); // Rrturned data must contain message key
				done();
			});
	});

	// Check if data is not provided
	it('Should return no data provided', function(done) {
		// Making a request to api
		chai.request(server)
			.post('/api/1.0/imageSizeChange')
			.set('token', token)
			.end(function(err, res){
				res.should.have.status(200); // Status of api must be 200
				res.body.should.be.a('object'); // Returned data must be a object
				res.body.should.have.property('success').eql(false); // Rrturned data must contain success key with vakue false
				res.body.should.have.property('message').eql('Something went wrong. Please provide a valid image Data.'); // Rrturned data must contain message key
				done();
			});
	});
});

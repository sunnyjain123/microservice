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
	it('Should return patched object', function(done) {
		var json = {
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

		chai.request(server)
			.post('/api/1.0/jsonPatch')
			.set('token', token)
			.send(json)
			.end(function(err, res){
				console.log(res.body);
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('baz').equal('boo');
				res.body.should.have.property('hello').equal('world');
				done();
			});
	});

	it('Should return not valid json patch', function(done) {
		var json = {
			obj : {
				"baz": "qux",
				"foo": "bar" 
			}
		}

		chai.request(server)
			.post('/api/1.0/jsonPatch')
			.set('token', token)
			.send(json)
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('Something went wrong. Please provide valid Data.');
				done();
			});
	});

	it('Should return not valid json object', function(done) {
		var json = {
			patch : [{
				"op": "replace", "path": "/baz", "value": "boo"
			},{
				"op": "add", "path": "/hello", "value": ["world"]
			},{
				"op": "remove", "path": "/foo"
			}]
		}

		chai.request(server)
			.post('/api/1.0/jsonPatch')
			.set('token', token)
			.send(json)
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('Something went wrong. Please provide valid Data.');
				done();
			});
	});

	it('Should return no token found', function(done) {
		var json = {
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

		chai.request(server)
			.post('/api/1.0/jsonPatch')
			.send(json)
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('Something went wrong. Please provide access token.');
				done();
			});
	});

	it('Should return Please login again', function(done) {
		var json = {
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

		chai.request(server)
			.post('/api/1.0/jsonPatch')
			.set('token', token + 'as')
			.send(json)
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('Failed to authenticate token. Please login again or try after some time.');
				done();
			});
	});

	it('Should return wrong patch data', function(done) {
		var json = {
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

		chai.request(server)
			.post('/api/1.0/jsonPatch')
			.set('token', token)
			.send(json)
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('Something went wrong. Please provide valid Data.');
				done();
			});
	});

	it('Should return not valid data', function(done) {
		var json = {
			obj : {
				"baz": "qux",
				"foo": "bar" 
			},
			patch : 'abc'
		}

		chai.request(server)
			.post('/api/1.0/jsonPatch')
			.set('token', token)
			.send(json)
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('Something went wrong. Please provide valid Data.');
				done();
			});
	});
});


// Image resize test cases
describe('POST /api/1.0/imageSizeChange', function() {
	it('Should return no token found', function(done) {
		var image = {
			image : 'https://s3.amazonaws.com/silverpushcdn/320x50_Datawind-Calling-Tablet.jpg'
		}

		chai.request(server)
			.post('/api/1.0/imageSizeChange')
			.send(image)
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('Something went wrong. Please provide access token.');
				done();
			});
	});

	it('Should return Please login again', function(done) {
		var image = {
			image : 'https://s3.amazonaws.com/silverpushcdn/320x50_Datawind-Calling-Tablet.jpg'
		}

		chai.request(server)
			.post('/api/1.0/imageSizeChange')
			.set('token', token + 'as')
			.send(image)
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('Failed to authenticate token. Please login again or try after some time.');
				done();
			});
	});

	it('Should return no image found', function(done) {
		var image = {
			image : ''
		}

		chai.request(server)
			.post('/api/1.0/imageSizeChange')
			.set('token', token)
			.send(image)
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('Something went wrong. Please provide a image url to resize.');
				done();
			});
	});

	it('Should return invalid image', function(done) {
		var image = {
			image : 'https://s3.amazonaws.com/silverpushcdn/320x50_Datawind-Calling-Talet.jpg'
		}

		chai.request(server)
			.post('/api/1.0/imageSizeChange')
			.set('token', token)
			.send(image)
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('Something went wrong. please check if image is private or url is correct.');
				done();
			});
	});

	it('Should return resized image', function(done) {
		var image = {
			image : 'https://s3.amazonaws.com/silverpushcdn/320x50_Datawind-Calling-Tablet.jpg'
		}

		chai.request(server)
			.post('/api/1.0/imageSizeChange')
			.set('token', token)
			.send(image)
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(true);
				res.body.should.have.property('url');
				done();
			});
	});
});

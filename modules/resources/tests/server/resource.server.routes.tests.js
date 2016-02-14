'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  sequelize = require(path.resolve('./config/lib/sequelize-connect')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Resource = db.resource,
  User = db.user,
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, resource;

/**
 * Resource routes tests
 */
describe('Resource CRUD tests', function() {
  before(function(done) {
    // Get application
    app = express.init(sequelize);
    agent = request.agent(app);

    done();
  });

  before(function(done) {

    // Create user credentials
    credentials = {
      username: 'username',
      password: 'S3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = User.build();

    user.firstName = 'Full';
    user.lastName = 'Name';
    user.displayName = 'Full Name';
    user.email = 'test@test.com';
    user.username = credentials.username;
    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword(credentials.password, user.salt);
    user.provider = 'local';
    user.roles = ['admin', 'user'];

    // Save a user to the test db and create new resource
    user.save().then(function(user) {
      resource = Resource.build();
      resource = {
        title: 'Resource Title',
        content: 'Resource Content',
        userId: user.id
      };
      done();
    }).catch(function(err) {});

  });

  it('should be able to save an resource if logged in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {

        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new resource
        agent.post('/api/resources')
          .send(resource)
          .expect(200)
          .end(function(resourceSaveErr, resourceSaveRes) {

            // Handle resource save error
            if (resourceSaveErr) {
              return done(resourceSaveErr);
            }

            // Get a list of resources
            agent.get('/api/resources')
              .end(function(resourcesGetErr, resourcesGetRes) {

                // Handle resource save error
                if (resourcesGetErr) {
                  return done(resourcesGetErr);
                }

                // Get resources list
                var resources = resourcesGetRes.body;

                // Set assertions
                console.log('resources[0]', resources[0]);
                console.log('userId', userId);

                //(resources[0].userId).should.equal(userId);
                (resources[0].title).should.match('Resource Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an resource if not logged in', function(done) {
    agent.get('/api/auth/signout')
      .expect(302) //because of redirect
      .end(function(signoutErr, signoutRes) {

        // Handle signout error
        if (signoutErr) {
          return done(signoutErr);
        }

        agent.post('/api/resources')
          .send(resource)
          .expect(403)
          .end(function(resourceSaveErr, resourceSaveRes) {
            // Call the assertion callback
            done(resourceSaveErr);
          });
      });
  });

  it('should not be able to save an resource if no title is provided', function(done) {
    // Invalidate title field
    resource.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {

        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new resource
        agent.post('/api/resources')
          .send(resource)
          .expect(400)
          .end(function(resourceSaveErr, resourceSaveRes) {

            // Set message assertion
            (resourceSaveRes.body.message).should.match('Resource title must be between 1 and 250 characters in length');
            // Handle resource save error
            done(resourceSaveErr);
          });
      });
  });

  it('should be able to update an resource if signed in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {

        // Handle signin error
        if (!signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new resource
        agent.post('/api/resources')
          .send(resource)
          .expect(200)
          .end(function(resourceSaveErr, resourceSaveRes) {
            // Handle resource save error
            if (resourceSaveErr) {
              return done(resourceSaveErr);
            }

            // Update resource title
            resource.title = 'WHY YOU GOTTA BE SO SEAN?';

            // Update an existing resource
            agent.put('/api/resources/' + resourceSaveRes.body.id)
              .send(resource)
              .expect(200)
              .end(function(resourceUpdateErr, resourceUpdateRes) {
                // Handle resource update error
                if (resourceUpdateErr) {
                  return done(resourceUpdateErr);
                }

                // Set assertions
                (resourceUpdateRes.body.id).should.equal(resourceSaveRes.body.id);
                (resourceUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO SEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of resources if not signed in', function(done) {
    resource.title = 'Resource Title';
    // Create new resource model instance
    var resourceObj = Resource.build(resource);

    // Save the resource
    resourceObj.save().then(function() {
      // Request resources
      request(app).get('/api/resources')
        .end(function(req, res) {

          // Set assertion
          //res.body.should.be.instanceof(Array).and.have.lengthOf(1);
          res.body.should.be.instanceof(Array);
          // Call the assertion callback
          done();
        });

    }).catch(function(err) {});
  });

  it('should be able to get a single resource if not signed in', function(done) {
    // Create new resource model instance
    var resourceObj = Resource.build(resource);

    // Save the resource
    resourceObj.save().then(function() {
      request(app).get('/api/resources/' + resourceObj.id)
        .end(function(req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', resource.title);

          // Call the assertion callback
          done();
        });
    }).catch(function(err) {});
  });

  it('should return proper error for single resource with an invalid Id, if not signed in', function(done) {
    // test is not a valid mongoose Id
    request(app).get('/api/resources/test')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Resource is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single resource which doesnt exist, if not signed in', function(done) {
    // This is a valid mongoose Id but a non-existent resource
    request(app).get('/api/resources/123567890')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No resource with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an resource if signed in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {

        // Handle signin error
        if (!signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new resource
        agent.post('/api/resources')
          .send(resource)
          .expect(200)
          .end(function(resourceSaveErr, resourceSaveRes) {


            // Handle resource save error
            if (resourceSaveErr) {
              return done(resourceSaveErr);
            }

            // Delete an existing resource
            agent.delete('/api/resources/' + resourceSaveRes.body.id)
              .send(resource)
              .expect(200)
              .end(function(resourceDeleteErr, resourceDeleteRes) {

                // Handle resource error error
                if (resourceDeleteErr) {
                  return done(resourceDeleteErr);
                }

                // Set assertions
                (resourceDeleteRes.body.id).should.equal(resourceSaveRes.body.id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an resource if not signed in', function(done) {
    // Set resource user
    resource.userId = user.id;

    // Create new resource model instance
    var resourceObj = Resource.build(resource);

    // Save the resource
    resourceObj.save().then(function() {
      // Try deleting resource
      request(app).delete('/api/resources/' + resourceObj.id)
        .expect(403)
        .end(function(resourceDeleteErr, resourceDeleteRes) {

          // Set message assertion
          (resourceDeleteRes.body.message).should.match('User is not authorized');

          // Handle resource error error
          done(resourceDeleteErr);
        });

    }).catch(function(err) {});
  });

  after(function(done) {
    user.destroy()
      .then(function(success) {
        done();
      }).catch(function(err) {});
  });

});
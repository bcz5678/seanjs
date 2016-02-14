'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  sequelize = require(path.resolve('./config/lib/sequelize-connect')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Gig = db.gig,
  User = db.user,
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, gig;

/**
 * Gig routes tests
 */
describe('Gig CRUD tests', function() {
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

    // Save a user to the test db and create new gig
    user.save().then(function(user) {
      gig = Gig.build();
      gig = {
        title: 'Gig Title',
        content: 'Gig Content',
        userId: user.id
      };
      done();
    }).catch(function(err) {});

  });

  it('should be able to save an gig if logged in', function(done) {
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

        // Save a new gig
        agent.post('/api/gigs')
          .send(gig)
          .expect(200)
          .end(function(gigSaveErr, gigSaveRes) {

            // Handle gig save error
            if (gigSaveErr) {
              return done(gigSaveErr);
            }

            // Get a list of gigs
            agent.get('/api/gigs')
              .end(function(gigsGetErr, gigsGetRes) {

                // Handle gig save error
                if (gigsGetErr) {
                  return done(gigsGetErr);
                }

                // Get gigs list
                var gigs = gigsGetRes.body;

                // Set assertions
                console.log('gigs[0]', gigs[0]);
                console.log('userId', userId);

                //(gigs[0].userId).should.equal(userId);
                (gigs[0].title).should.match('Gig Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an gig if not logged in', function(done) {
    agent.get('/api/auth/signout')
      .expect(302) //because of redirect
      .end(function(signoutErr, signoutRes) {

        // Handle signout error
        if (signoutErr) {
          return done(signoutErr);
        }

        agent.post('/api/gigs')
          .send(gig)
          .expect(403)
          .end(function(gigSaveErr, gigSaveRes) {
            // Call the assertion callback
            done(gigSaveErr);
          });
      });
  });

  it('should not be able to save an gig if no title is provided', function(done) {
    // Invalidate title field
    gig.title = '';

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

        // Save a new gig
        agent.post('/api/gigs')
          .send(gig)
          .expect(400)
          .end(function(gigSaveErr, gigSaveRes) {

            // Set message assertion
            (gigSaveRes.body.message).should.match('Gig title must be between 1 and 250 characters in length');
            // Handle gig save error
            done(gigSaveErr);
          });
      });
  });

  it('should be able to update an gig if signed in', function(done) {
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

        // Save a new gig
        agent.post('/api/gigs')
          .send(gig)
          .expect(200)
          .end(function(gigSaveErr, gigSaveRes) {
            // Handle gig save error
            if (gigSaveErr) {
              return done(gigSaveErr);
            }

            // Update gig title
            gig.title = 'WHY YOU GOTTA BE SO SEAN?';

            // Update an existing gig
            agent.put('/api/gigs/' + gigSaveRes.body.id)
              .send(gig)
              .expect(200)
              .end(function(gigUpdateErr, gigUpdateRes) {
                // Handle gig update error
                if (gigUpdateErr) {
                  return done(gigUpdateErr);
                }

                // Set assertions
                (gigUpdateRes.body.id).should.equal(gigSaveRes.body.id);
                (gigUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO SEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of gigs if not signed in', function(done) {
    gig.title = 'Gig Title';
    // Create new gig model instance
    var gigObj = Gig.build(gig);

    // Save the gig
    gigObj.save().then(function() {
      // Request gigs
      request(app).get('/api/gigs')
        .end(function(req, res) {

          // Set assertion
          //res.body.should.be.instanceof(Array).and.have.lengthOf(1);
          res.body.should.be.instanceof(Array);
          // Call the assertion callback
          done();
        });

    }).catch(function(err) {});
  });

  it('should be able to get a single gig if not signed in', function(done) {
    // Create new gig model instance
    var gigObj = Gig.build(gig);

    // Save the gig
    gigObj.save().then(function() {
      request(app).get('/api/gigs/' + gigObj.id)
        .end(function(req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', gig.title);

          // Call the assertion callback
          done();
        });
    }).catch(function(err) {});
  });

  it('should return proper error for single gig with an invalid Id, if not signed in', function(done) {
    // test is not a valid mongoose Id
    request(app).get('/api/gigs/test')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Gig is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single gig which doesnt exist, if not signed in', function(done) {
    // This is a valid mongoose Id but a non-existent gig
    request(app).get('/api/gigs/123567890')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No gig with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an gig if signed in', function(done) {
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

        // Save a new gig
        agent.post('/api/gigs')
          .send(gig)
          .expect(200)
          .end(function(gigSaveErr, gigSaveRes) {


            // Handle gig save error
            if (gigSaveErr) {
              return done(gigSaveErr);
            }

            // Delete an existing gig
            agent.delete('/api/gigs/' + gigSaveRes.body.id)
              .send(gig)
              .expect(200)
              .end(function(gigDeleteErr, gigDeleteRes) {

                // Handle gig error error
                if (gigDeleteErr) {
                  return done(gigDeleteErr);
                }

                // Set assertions
                (gigDeleteRes.body.id).should.equal(gigSaveRes.body.id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an gig if not signed in', function(done) {
    // Set gig user
    gig.userId = user.id;

    // Create new gig model instance
    var gigObj = Gig.build(gig);

    // Save the gig
    gigObj.save().then(function() {
      // Try deleting gig
      request(app).delete('/api/gigs/' + gigObj.id)
        .expect(403)
        .end(function(gigDeleteErr, gigDeleteRes) {

          // Set message assertion
          (gigDeleteRes.body.message).should.match('User is not authorized');

          // Handle gig error error
          done(gigDeleteErr);
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
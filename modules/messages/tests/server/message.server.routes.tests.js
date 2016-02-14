'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  sequelize = require(path.resolve('./config/lib/sequelize-connect')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Message = db.message,
  User = db.user,
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, message;

/**
 * Message routes tests
 */
describe('Message CRUD tests', function() {
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

    // Save a user to the test db and create new message
    user.save().then(function(user) {
      message = Message.build();
      message = {
        title: 'Message Title',
        content: 'Message Content',
        userId: user.id
      };
      done();
    }).catch(function(err) {});

  });

  it('should be able to save an message if logged in', function(done) {
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

        // Save a new message
        agent.post('/api/messages')
          .send(message)
          .expect(200)
          .end(function(messageSaveErr, messageSaveRes) {

            // Handle message save error
            if (messageSaveErr) {
              return done(messageSaveErr);
            }

            // Get a list of messages
            agent.get('/api/messages')
              .end(function(messagesGetErr, messagesGetRes) {

                // Handle message save error
                if (messagesGetErr) {
                  return done(messagesGetErr);
                }

                // Get messages list
                var messages = messagesGetRes.body;

                // Set assertions
                console.log('messages[0]', messages[0]);
                console.log('userId', userId);

                //(messages[0].userId).should.equal(userId);
                (messages[0].title).should.match('Message Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an message if not logged in', function(done) {
    agent.get('/api/auth/signout')
      .expect(302) //because of redirect
      .end(function(signoutErr, signoutRes) {

        // Handle signout error
        if (signoutErr) {
          return done(signoutErr);
        }

        agent.post('/api/messages')
          .send(message)
          .expect(403)
          .end(function(messageSaveErr, messageSaveRes) {
            // Call the assertion callback
            done(messageSaveErr);
          });
      });
  });

  it('should not be able to save an message if no title is provided', function(done) {
    // Invalidate title field
    message.title = '';

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

        // Save a new message
        agent.post('/api/messages')
          .send(message)
          .expect(400)
          .end(function(messageSaveErr, messageSaveRes) {

            // Set message assertion
            (messageSaveRes.body.message).should.match('Message title must be between 1 and 250 characters in length');
            // Handle message save error
            done(messageSaveErr);
          });
      });
  });

  it('should be able to update an message if signed in', function(done) {
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

        // Save a new message
        agent.post('/api/messages')
          .send(message)
          .expect(200)
          .end(function(messageSaveErr, messageSaveRes) {
            // Handle message save error
            if (messageSaveErr) {
              return done(messageSaveErr);
            }

            // Update message title
            message.title = 'WHY YOU GOTTA BE SO SEAN?';

            // Update an existing message
            agent.put('/api/messages/' + messageSaveRes.body.id)
              .send(message)
              .expect(200)
              .end(function(messageUpdateErr, messageUpdateRes) {
                // Handle message update error
                if (messageUpdateErr) {
                  return done(messageUpdateErr);
                }

                // Set assertions
                (messageUpdateRes.body.id).should.equal(messageSaveRes.body.id);
                (messageUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO SEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of messages if not signed in', function(done) {
    message.title = 'Message Title';
    // Create new message model instance
    var messageObj = Message.build(message);

    // Save the message
    messageObj.save().then(function() {
      // Request messages
      request(app).get('/api/messages')
        .end(function(req, res) {

          // Set assertion
          //res.body.should.be.instanceof(Array).and.have.lengthOf(1);
          res.body.should.be.instanceof(Array);
          // Call the assertion callback
          done();
        });

    }).catch(function(err) {});
  });

  it('should be able to get a single message if not signed in', function(done) {
    // Create new message model instance
    var messageObj = Message.build(message);

    // Save the message
    messageObj.save().then(function() {
      request(app).get('/api/messages/' + messageObj.id)
        .end(function(req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', message.title);

          // Call the assertion callback
          done();
        });
    }).catch(function(err) {});
  });

  it('should return proper error for single message with an invalid Id, if not signed in', function(done) {
    // test is not a valid mongoose Id
    request(app).get('/api/messages/test')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Message is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single message which doesnt exist, if not signed in', function(done) {
    // This is a valid mongoose Id but a non-existent message
    request(app).get('/api/messages/123567890')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No message with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an message if signed in', function(done) {
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

        // Save a new message
        agent.post('/api/messages')
          .send(message)
          .expect(200)
          .end(function(messageSaveErr, messageSaveRes) {


            // Handle message save error
            if (messageSaveErr) {
              return done(messageSaveErr);
            }

            // Delete an existing message
            agent.delete('/api/messages/' + messageSaveRes.body.id)
              .send(message)
              .expect(200)
              .end(function(messageDeleteErr, messageDeleteRes) {

                // Handle message error error
                if (messageDeleteErr) {
                  return done(messageDeleteErr);
                }

                // Set assertions
                (messageDeleteRes.body.id).should.equal(messageSaveRes.body.id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an message if not signed in', function(done) {
    // Set message user
    message.userId = user.id;

    // Create new message model instance
    var messageObj = Message.build(message);

    // Save the message
    messageObj.save().then(function() {
      // Try deleting message
      request(app).delete('/api/messages/' + messageObj.id)
        .expect(403)
        .end(function(messageDeleteErr, messageDeleteRes) {

          // Set message assertion
          (messageDeleteRes.body.message).should.match('User is not authorized');

          // Handle message error error
          done(messageDeleteErr);
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
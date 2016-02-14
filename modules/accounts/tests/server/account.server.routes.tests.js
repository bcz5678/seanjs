'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  sequelize = require(path.resolve('./config/lib/sequelize-connect')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Account = db.account,
  User = db.user,
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, account;

/**
 * Account routes tests
 */
describe('Account CRUD tests', function() {
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

    // Save a user to the test db and create new account
    user.save().then(function(user) {
      account = Account.build();
      account = {
        title: 'Account Title',
        content: 'Account Content',
        userId: user.id
      };
      done();
    }).catch(function(err) {});

  });

  it('should be able to save an account if logged in', function(done) {
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

        // Save a new account
        agent.post('/api/accounts')
          .send(account)
          .expect(200)
          .end(function(accountSaveErr, accountSaveRes) {

            // Handle account save error
            if (accountSaveErr) {
              return done(accountSaveErr);
            }

            // Get a list of accounts
            agent.get('/api/accounts')
              .end(function(accountsGetErr, accountsGetRes) {

                // Handle account save error
                if (accountsGetErr) {
                  return done(accountsGetErr);
                }

                // Get accounts list
                var accounts = accountsGetRes.body;

                // Set assertions
                console.log('accounts[0]', accounts[0]);
                console.log('userId', userId);

                //(accounts[0].userId).should.equal(userId);
                (accounts[0].title).should.match('Account Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an account if not logged in', function(done) {
    agent.get('/api/auth/signout')
      .expect(302) //because of redirect
      .end(function(signoutErr, signoutRes) {

        // Handle signout error
        if (signoutErr) {
          return done(signoutErr);
        }

        agent.post('/api/accounts')
          .send(account)
          .expect(403)
          .end(function(accountSaveErr, accountSaveRes) {
            // Call the assertion callback
            done(accountSaveErr);
          });
      });
  });

  it('should not be able to save an account if no title is provided', function(done) {
    // Invalidate title field
    account.title = '';

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

        // Save a new account
        agent.post('/api/accounts')
          .send(account)
          .expect(400)
          .end(function(accountSaveErr, accountSaveRes) {

            // Set message assertion
            (accountSaveRes.body.message).should.match('Account title must be between 1 and 250 characters in length');
            // Handle account save error
            done(accountSaveErr);
          });
      });
  });

  it('should be able to update an account if signed in', function(done) {
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

        // Save a new account
        agent.post('/api/accounts')
          .send(account)
          .expect(200)
          .end(function(accountSaveErr, accountSaveRes) {
            // Handle account save error
            if (accountSaveErr) {
              return done(accountSaveErr);
            }

            // Update account title
            account.title = 'WHY YOU GOTTA BE SO SEAN?';

            // Update an existing account
            agent.put('/api/accounts/' + accountSaveRes.body.id)
              .send(account)
              .expect(200)
              .end(function(accountUpdateErr, accountUpdateRes) {
                // Handle account update error
                if (accountUpdateErr) {
                  return done(accountUpdateErr);
                }

                // Set assertions
                (accountUpdateRes.body.id).should.equal(accountSaveRes.body.id);
                (accountUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO SEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of accounts if not signed in', function(done) {
    account.title = 'Account Title';
    // Create new account model instance
    var accountObj = Account.build(account);

    // Save the account
    accountObj.save().then(function() {
      // Request accounts
      request(app).get('/api/accounts')
        .end(function(req, res) {

          // Set assertion
          //res.body.should.be.instanceof(Array).and.have.lengthOf(1);
          res.body.should.be.instanceof(Array);
          // Call the assertion callback
          done();
        });

    }).catch(function(err) {});
  });

  it('should be able to get a single account if not signed in', function(done) {
    // Create new account model instance
    var accountObj = Account.build(account);

    // Save the account
    accountObj.save().then(function() {
      request(app).get('/api/accounts/' + accountObj.id)
        .end(function(req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', account.title);

          // Call the assertion callback
          done();
        });
    }).catch(function(err) {});
  });

  it('should return proper error for single account with an invalid Id, if not signed in', function(done) {
    // test is not a valid mongoose Id
    request(app).get('/api/accounts/test')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Account is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single account which doesnt exist, if not signed in', function(done) {
    // This is a valid mongoose Id but a non-existent account
    request(app).get('/api/accounts/123567890')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No account with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an account if signed in', function(done) {
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

        // Save a new account
        agent.post('/api/accounts')
          .send(account)
          .expect(200)
          .end(function(accountSaveErr, accountSaveRes) {


            // Handle account save error
            if (accountSaveErr) {
              return done(accountSaveErr);
            }

            // Delete an existing account
            agent.delete('/api/accounts/' + accountSaveRes.body.id)
              .send(account)
              .expect(200)
              .end(function(accountDeleteErr, accountDeleteRes) {

                // Handle account error error
                if (accountDeleteErr) {
                  return done(accountDeleteErr);
                }

                // Set assertions
                (accountDeleteRes.body.id).should.equal(accountSaveRes.body.id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an account if not signed in', function(done) {
    // Set account user
    account.userId = user.id;

    // Create new account model instance
    var accountObj = Account.build(account);

    // Save the account
    accountObj.save().then(function() {
      // Try deleting account
      request(app).delete('/api/accounts/' + accountObj.id)
        .expect(403)
        .end(function(accountDeleteErr, accountDeleteRes) {

          // Set message assertion
          (accountDeleteRes.body.message).should.match('User is not authorized');

          // Handle account error error
          done(accountDeleteErr);
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
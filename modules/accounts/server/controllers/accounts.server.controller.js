'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Account = db.account;

/**
 * Create a account
 */
exports.create = function(req, res) {

  req.body.userId = req.user.id;

  Account.create(req.body).then(function(account) {
    if (!account) {
      return res.send('accounts/create', {
        errors: 'Could not create the account'
      });
    } else {
      return res.jsonp(account);
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current account
 */
exports.read = function(req, res) {
  res.json(req.account);
};

/**
 * Update a account
 */
exports.update = function(req, res) {
  var account = req.account;

  account.updateAttributes({
    title: req.body.title,
    content: req.body.content
  }).then(function(account) {
    res.json(account);
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an account
 */
exports.delete = function(req, res) {
  var account = req.account;

  // Find the account
  Account.findById(account.id).then(function(account) {
    if (account) {

      // Delete the account
      account.destroy().then(function() {
        return res.json(account);
      }).catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

    } else {
      return res.status(400).send({
        message: 'Unable to find the account'
      });
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};

/**
 * List of Accounts
 */
exports.list = function(req, res) {
  Account.findAll({
    include: [db.user]
  }).then(function(accounts) {
    if (!accounts) {
      return res.status(404).send({
        message: 'No accounts found'
      });
    } else {
      res.json(accounts);
    }
  }).catch(function(err) {
    res.jsonp(err);
  });
};

/**
 * Account middleware
 */
exports.accountByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) { //check if it's integer
    return res.status(404).send({
      message: 'Account is invalid'
    });
  }

  Account.find({
    where: {
      id: id
    },
    include: [{
      model: db.user
    }]
  }).then(function(account) {
    if (!account) {
      return res.status(404).send({
        message: 'No account with that identifier has been found'
      });
    } else {
      req.account = account;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};
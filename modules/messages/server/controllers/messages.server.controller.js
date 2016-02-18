'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Message = db.message;

/**
 * Create a message
 */
exports.create = function(req, res) {

  req.body.userId = req.user.id;

  Message.create(req.body).then(function(message) {
    if (!message) {
      return res.send('messages/create', {
        errors: 'Could not create the message'
      });
    } else {
      return res.jsonp(message);
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current message
 */
exports.read = function(req, res) {
  res.json(req.message);
};

/**
 * Update a message
 */
exports.update = function(req, res) {
  var message = req.message;

  message.updateAttributes({
    title: req.body.title,
    content: req.body.content
  }).then(function(message) {
    res.json(message);
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an message
 */
exports.delete = function(req, res) {
  var message = req.message;

  // Find the message
  Message.findById(message.id).then(function(message) {
    if (message) {

      // Delete the message
      message.destroy().then(function() {
        return res.json(message);
      }).catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

    } else {
      return res.status(400).send({
        message: 'Unable to find the message'
      });
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};

/**
 * List of Messages
 */
exports.list = function(req, res) {
  Message.findAll({
    include: [db.user]
  }).then(function(messages) {
    if (!messages) {
      return res.status(404).send({
        message: 'No messages found'
      });
    } else {
      res.json(messages);
    }
  }).catch(function(err) {
    res.jsonp(err);
  });
};

/**
 * List of Messages
 */
exports.unread = function(req, res) {
  Message.find({
    where: {
      read: false
    },
    include: [{
      model: db.user
    }]
  }).then(function(messages) {
    if (!messages) {
      return res.status(404).send({
        message: 'No messages found'
      });
    } else {
      res.json(messages);
    }
  }).catch(function(err) {
    res.jsonp(err);
  });
};

/**
 * Message middleware
 */
exports.messageByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) {
    //check if it's integer
    return res.status(404).send({
      message: 'Message is invalid'
    });
  }

  Message.find({
    where: {
      id: id
    },
    include: [{
      model: db.user
    }]
  }).then(function(message) {
    if (!message) {
      return res.status(404).send({
        message: 'No message with that identifier has been found'
      });
    } else {
      req.message = message;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};
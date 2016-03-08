'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  talent = db.talent;

/**
 * Create a talent
 */
exports.create = function(req, res) {

  req.body.userId = req.user.id;

  talent.create(req.body).then(function(talent) {
    if (!talent) {
      return res.send('talent/create', {
        errors: 'Could not create the talent'
      });
    } else {
      return res.jsonp(talent);
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current talent
 */
exports.read = function(req, res) {
  res.json(req.talent);
};

/**
 * Update a talent
 */
exports.update = function(req, res) {
  var talent = req.talent;

  talent.updateAttributes({
    title: req.body.title,
    content: req.body.content
  }).then(function(talent) {
    res.json(talent);
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an talent
 */
exports.delete = function(req, res) {
  var talent = req.talent;

  // Find the talent
  talent.findById(talent.id).then(function(talent) {
    if (talent) {

      // Delete the talent
      talent.destroy().then(function() {
        return res.json(talent);
      }).catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

    } else {
      return res.status(400).send({
        message: 'Unable to find the talent'
      });
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};

/**
 * List of talent
 */
exports.list = function(req, res) {
  talent.findAll({
    include: [db.user]
  }).then(function(talent) {
    if (!talent) {
      return res.status(404).send({
        message: 'No talent found'
      });
    } else {
      res.json(talent);
    }
  }).catch(function(err) {
    res.jsonp(err);
  });
};

/**
 * talent middleware
 */
exports.talentByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) { //check if it's integer
    return res.status(404).send({
      message: 'talent is invalid'
    });
  }

  talent.find({
    where: {
      id: id
    },
    include: [{
      model: db.user
    }]
  }).then(function(talent) {
    if (!talent) {
      return res.status(404).send({
        message: 'No talent with that identifier has been found'
      });
    } else {
      req.talent = talent;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};
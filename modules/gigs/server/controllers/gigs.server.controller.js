'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Gig = db.gig;

/**
 * Create a gig
 */
exports.create = function(req, res) {

  req.body.userId = req.user.id;

  Gig.create(req.body).then(function(gig) {
    if (!gig) {
      return res.send('users/signup', {
        errors: 'Could not create the gig'
      });
    } else {
      return res.jsonp(gig);
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current gig
 */
exports.read = function(req, res) {
  res.json(req.gig);
};

/**
 * Update a gig
 */
exports.update = function(req, res) {
  var gig = req.gig;

  gig.updateAttributes({
    title: req.body.title,
    content: req.body.content
  }).then(function(gig) {
    res.json(gig);
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an gig
 */
exports.delete = function(req, res) {
  var gig = req.gig;

  // Find the gig
  Gig.findById(gig.id).then(function(gig) {
    if (gig) {

      // Delete the gig
      gig.destroy().then(function() {
        return res.json(gig);
      }).catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

    } else {
      return res.status(400).send({
        message: 'Unable to find the gig'
      });
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};

/**
 * List of Gigs
 */
exports.list = function(req, res) {
  Gig.findAll({
    include: [db.user]
  }).then(function(gigs) {
    if (!gigs) {
      return res.status(404).send({
        message: 'No gigs found'
      });
    } else {
      res.json(gigs);
    }
  }).catch(function(err) {
    res.jsonp(err);
  });
};

/**
 * Gig middleware
 */
exports.gigByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) { //check if it's integer
    return res.status(404).send({
      message: 'Gig is invalid'
    });
  }

  Gig.find({
    where: {
      id: id
    },
    include: [{
      model: db.user
    }]
  }).then(function(gig) {
    if (!gig) {
      return res.status(404).send({
        message: 'No gig with that identifier has been found'
      });
    } else {
      req.gig = gig;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};
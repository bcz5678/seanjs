'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Resource = db.resource;

/**
 * Create a resource
 */
exports.create = function(req, res) {

  req.body.userId = req.user.id;

  Resource.create(req.body).then(function(resource) {
    if (!resource) {
      return res.send('resources/create', {
        errors: 'Could not create the resource'
      });
    } else {
      return res.jsonp(resource);
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current resource
 */
exports.read = function(req, res) {
  res.json(req.resource);
};

/**
 * Update a resource
 */
exports.update = function(req, res) {
  var resource = req.resource;

  resource.updateAttributes({
    title: req.body.title,
    content: req.body.content
  }).then(function(resource) {
    res.json(resource);
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an resource
 */
exports.delete = function(req, res) {
  var resource = req.resource;

  // Find the resource
  Resource.findById(resource.id).then(function(resource) {
    if (resource) {

      // Delete the resource
      resource.destroy().then(function() {
        return res.json(resource);
      }).catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

    } else {
      return res.status(400).send({
        message: 'Unable to find the resource'
      });
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};

/**
 * List of Resources
 */
exports.list = function(req, res) {
  Resource.findAll({
    include: [db.user]
  }).then(function(resources) {
    if (!resources) {
      return res.status(404).send({
        message: 'No resources found'
      });
    } else {
      res.json(resources);
    }
  }).catch(function(err) {
    res.jsonp(err);
  });
};

/**
 * Resource middleware
 */
exports.resourceByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) { //check if it's integer
    return res.status(404).send({
      message: 'Resource is invalid'
    });
  }

  Resource.find({
    where: {
      id: id
    },
    include: [{
      model: db.user
    }]
  }).then(function(resource) {
    if (!resource) {
      return res.status(404).send({
        message: 'No resource with that identifier has been found'
      });
    } else {
      req.resource = resource;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};
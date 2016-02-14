'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  gigsPolicy = require('../policies/gigs.server.policy'),
  gigs = require(path.resolve('./modules/gigs/server/controllers/gigs.server.controller'));


module.exports = function(app) {

  // Gigs collection routes
  app.route('/api/gigs')
    .all(gigsPolicy.isAllowed)
    .get(gigs.list)
    .post(gigs.create);

  // Single gig routes
  app.route('/api/gigs/:gigId')
    .all(gigsPolicy.isAllowed)
    .get(gigs.read)
    .put(gigs.update)
    .delete(gigs.delete);

  // Finish by binding the gig middleware
  app.param('gigId', gigs.gigByID);

};
'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  talentPolicy = require('../policies/talent.server.policy'),
  talent = require(path.resolve('./modules/talents/server/controllers/talent.server.controller.js'));


module.exports = function(app) {

  // talent collection routes
  app.route('/api/talent')
    .all(talentPolicy.isAllowed)
    .get(talent.list)
    .post(talent.create);

  // Single talent routes
  app.route('/api/talent/:talentId')
    .all(talentPolicy.isAllowed)
    .get(talent.read)
    .put(talent.update)
    .delete(talent.delete);


  // Finish by binding the talent middleware
  app.param('talentId', talent.talentByID);

};
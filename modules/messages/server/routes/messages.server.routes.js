'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  messagesPolicy = require('../policies/messages.server.policy'),
  messages = require(path.resolve('./modules/messages/server/controllers/messages.server.controller'));


module.exports = function(app) {

  // Messages collection routes
  app.route('/api/messages')
    .all(messagesPolicy.isAllowed)
    .get(messages.list)
    .post(messages.create);

  // Messages collection routes
  app.route('/api/messages/unread')
    .all(messagesPolicy.isAllowed)
    .get(messages.unread);

  // Single message routes
  app.route('/api/messages/:messageId([0-9]+)')
    .all(messagesPolicy.isAllowed)
    .get(messages.read)
    .put(messages.update)
    .delete(messages.delete);

  // Finish by binding the message middleware
  app.param('messageId', messages.messageByID);

};
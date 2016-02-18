'use strict';

var
  path = require('path'),
  config = require(path.resolve('./config/config')),
  redisInstance = require('redis').createClient(config.redis.port, config.redis.host, {
    no_ready_check: true
  }),
  acl = require('acl');

/**
 * Module dependencies.
 */

// Using the redis backend

//Use redis database 1
redisInstance.select(1);

if (config.redis.password) {
  redisInstance.auth(config.redis.password);
}

acl = new acl(new acl.redisBackend(redisInstance, 'acl'));

/**
 * Invoke Messages Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/messages',
      permissions: '*'
    }, {
      resources: '/api/messages/:messageId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/messages',
      permissions: ['get', 'post']
    },{
      resources: '/api/messages/unread',
      permissions: ['get']
    },{
      resources: '/api/messages/:messageId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/messages',
      permissions: ['get']
    }, {
      resources: '/api/messages/:messageId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Messages Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an message is being processed and the current user created it then allow any manipulation
  if (req.message && req.user && req.message.userId === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
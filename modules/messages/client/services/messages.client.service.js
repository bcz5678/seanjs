'use strict';

//Messages service used for communicating with the messages REST endpoints
angular.module('messages').factory('Messages', ['$resource',
  function($resource) {
    return $resource('api/messages/:messageId', {
      messageId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//Messages service used for communicating with the messages REST endpoints
angular.module('messages').factory('TalentProfiles', ['$resource',
  function($resource) {
    return $resource('api/talentprofiles/:messageId', {
      messageId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
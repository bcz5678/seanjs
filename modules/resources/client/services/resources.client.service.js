'use strict';

//Resources service used for communicating with the resources REST endpoints
angular.module('resources').factory('Resources', ['$resource',
  function($resource) {
    return $resource('api/resources/:resourceId', {
      resourceId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//Resources service used for communicating with the resources REST endpoints
angular.module('resources').factory('TalentProfiles', ['$resource',
  function($resource) {
    return $resource('api/talentprofiles/:resourceId', {
      resourceId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
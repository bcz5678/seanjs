'use strict';

//talents service used for communicating with the talents REST endpoints
angular.module('talents').factory('talents', ['$resource',
  function($resource) {
    return $resource('api/talents/:talentId', {
      talentId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//talents service used for communicating with the talents REST endpoints
angular.module('talents').factory('TalentProfiles', ['$resource',
  function($resource) {
    return $resource('api/talent/:profileId', {
      talentId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
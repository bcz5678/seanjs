'use strict';

//talents service used for communicating with the talents REST endpoints
angular.module('talents').factory('Talents', ['$resource',
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
      profileId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//talents service used for communicating with the talents REST endpoints
angular.module('talents').factory('TalentMedia', ['$resource',
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
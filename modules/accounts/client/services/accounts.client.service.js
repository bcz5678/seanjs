'use strict';

//Accounts service used for communicating with the accounts REST endpoints
angular.module('accounts').factory('Accounts', ['$resource',
  function($resource) {
    return $resource('api/accounts/:accountId', {
      accountId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//Accounts service used for communicating with the accounts REST endpoints
angular.module('accounts').factory('TalentProfiles', ['$resource',
  function($resource) {
    return $resource('api/talent/:profileId', {
      accountId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
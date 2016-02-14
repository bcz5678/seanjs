'use strict';

//Gigs service used for communicating with the gigs REST endpoints
angular.module('gigs').factory('Gigs', ['$resource',
  function($resource) {
    return $resource('api/gigs/:gigId', {
      gigId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
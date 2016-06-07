'use strict';

// Setting up route
angular.module('talents').config(['$stateProvider',
  function($stateProvider) {
    // talents state routing

    $stateProvider
      .state('talents', {
        abstract: true,
        url: '/talent',
        template: '<ui-view/>'
      })
      .state('talents.list', {
        url: '',
        templateUrl: 'modules/talents/client/views/list-talents.client.view.html'
      })
      .state('talents.create', {
        url: '/create',
        templateUrl: 'modules/talents/client/views/create-talent.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('talents.upload', {
        url: '/upload',
        templateUrl: 'modules/talents/client/views/upload-talent.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('talents.view', {
        url: '/:talentId',
        templateUrl: 'modules/talents/client/views/view-talent.client.view.html'
      })
      .state('talents.edit', {
        url: '/:talentId/edit',
        templateUrl: 'modules/talents/client/views/edit-talent.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
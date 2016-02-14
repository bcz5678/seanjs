'use strict';

// Setting up route
angular.module('resources').config(['$stateProvider',
  function($stateProvider) {
    // Resources state routing

    $stateProvider
      .state('resources', {
        abstract: true,
        url: '/resources',
        template: '<ui-view/>'
      })
      .state('resources.list', {
        url: '',
        templateUrl: 'modules/resources/client/views/list-resources.client.view.html'
      })
      .state('resources.create', {
        url: '/create',
        templateUrl: 'modules/resources/client/views/create-resource.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('resources.view', {
        url: '/:resourceId',
        templateUrl: 'modules/resources/client/views/view-resource.client.view.html'
      })
      .state('resources.edit', {
        url: '/:resourceId/edit',
        templateUrl: 'modules/resources/client/views/edit-resource.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
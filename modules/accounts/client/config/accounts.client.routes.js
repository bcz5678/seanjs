'use strict';

// Setting up route
angular.module('accounts').config(['$stateProvider',
  function($stateProvider) {
    // Accounts state routing

    $stateProvider
      .state('accounts', {
        abstract: true,
        url: '/accounts',
        template: '<ui-view/>'
      })
      .state('accounts.list', {
        url: '',
        templateUrl: 'modules/accounts/client/views/list-accounts.client.view.html'
      })
      .state('accounts.create', {
        url: '/create',
        templateUrl: 'modules/accounts/client/views/create-account.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('accounts.view', {
        url: '/:accountId',
        templateUrl: 'modules/accounts/client/views/view-account.client.view.html'
      })
      .state('accounts.edit', {
        url: '/:accountId/edit',
        templateUrl: 'modules/accounts/client/views/edit-account.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
'use strict';

// Setting up route
angular.module('gigs').config(['$stateProvider',
  function($stateProvider) {
    // Gigs state routing

    $stateProvider
      .state('gigs', {
        abstract: true,
        url: '/gigs',
        template: '<ui-view/>'
      })
      .state('gigs.list', {
        url: '',
        templateUrl: 'modules/gigs/client/views/list-gigs.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('gigs.create', {
        url: '/create',
        templateUrl: 'modules/gigs/client/views/create-gig.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('gigs.view', {
        url: '/:gigId',
        templateUrl: 'modules/gigs/client/views/view-gig.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('gigs.edit', {
        url: '/:gigId/edit',
        templateUrl: 'modules/gigs/client/views/edit-gig.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('gigs.wizard', {
        abstract: true,
        url: '/wizard',
        templateUrl: 'modules/gigs/client/views/wizard/wizard.client.view.html',
        controller: 'wizardController',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('gigs.wizard.step-one', {
        url: '/step-one',
        templateUrl: 'modules/gigs/client/views/wizard/step-one.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('gigs.wizard.step-two', {
        url: '/step-two',
        templateUrl: 'modules/gigs/client/views/wizard/step-two.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('gigs.wizard.step-three', {
        url: '/step-three',
        templateUrl: 'modules/gigs/client/views/wizard/step-three.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('gigs.wizard.step-four', {
        url: '/step-four',
        templateUrl: 'modules/gigs/client/views/wizard/step-four.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('gigs.wizard.step-five', {
        url: '/step-five',
        templateUrl: 'modules/gigs/client/views/wizard/step-five.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
       .state('gigs.wizard.step-six', {
        url: '/step-six',
        templateUrl: 'modules/gigs/client/views/wizard/step-six.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);


'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'modules/core/client/views/home.client.view.html'
      })
      .state('dash', {
        abstract: true,
        url: '/dash',
        template: '<ui-view/>',
      })
      .state('dash.home', {
        url: '',
        templateUrl: 'modules/core/client/views/dash.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('dash.gigs', {
        abstract: true,
        url: '',
        template: '<ui-view/>',
      })
      .state('dash.gigs.list', {
        url: '/gigs',
        templateUrl: 'modules/gigs/client/views/list-gigs.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('dash.resources', {
        abstract: true,
        url: '',
        template: '<ui-view/>',
      })
      .state('dash.resources.list', {
        url: '/resources',
        templateUrl: 'modules/resources/client/views/list-resources.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('dash.messages', {
        abstract: true,
        url: '',
        template: '<ui-view/>',
      })
      .state('dash.messages.list', {
        url: '/messages',
        templateUrl: 'modules/messages/client/views/list-messages.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('dash.accounts', {
        abstract: true,
        url: '',
        template: '<ui-view/>',
      })
      .state('dash.accounts.list', {
        url: '/accounts',
        templateUrl: 'modules/accounts/client/views/list-accounts.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('how-it-works', {
        url: '/how-it-works',
        templateUrl: 'modules/core/client/views/howItWorks.client.view.html'
      })
      .state('share-and-earn', {
        url: '/share-and-earn',
        templateUrl: 'modules/core/client/views/shareAndEarn.client.view.html'
      })
      .state('contact-us', {
        url: '/contact-us',
        templateUrl: 'modules/core/client/views/contact.client.view.html'
      }) 
      .state('not-found', {
        url: '/not-found',
        templateUrl: 'modules/core/client/views/404.client.view.html',
        data: {
          ignoreState: true
        }
      })
      .state('bad-request', {
        url: '/bad-request',
        templateUrl: 'modules/core/client/views/400.client.view.html',
        data: {
          ignoreState: true
        }
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: 'modules/core/client/views/403.client.view.html',
        data: {
          ignoreState: true
        }
      });
  }
]);

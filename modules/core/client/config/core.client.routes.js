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
      .state('dash.gigs.view', {
        url: '/gigs/:gigId',
        templateUrl: 'modules/gigs/client/views/view-gig.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('dash.gigs.wizard', {
        abstract: true,
        url: '/wizard',
        templateUrl: 'modules/gigs/client/views/wizard/wizard.client.view.html',
        controller: 'wizardController',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('dash.gigs.wizard.index', {
        url: '/wizard-index',
        templateUrl: 'modules/gigs/client/views/wizard/wizard-index.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('dash.gigs.wizard.step-one', {
        url: '/step-one',
        templateUrl: 'modules/gigs/client/views/wizard/step-one.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('dash.gigs.wizard.step-two', {
        url: '/step-two',
        templateUrl: 'modules/gigs/client/views/wizard/step-two.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('dash.gigs.wizard.step-three', {
        url: '/step-three',
        templateUrl: 'modules/gigs/client/views/wizard/step-three.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('dash.gigs.wizard.step-four', {
        url: '/step-four',
        templateUrl: 'modules/gigs/client/views/wizard/step-four.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('dash.gigs.wizard.step-five', {
        url: '/step-five',
        templateUrl: 'modules/gigs/client/views/wizard/step-five.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
       .state('dash.gigs.wizard.step-six', {
        url: '/step-six',
        templateUrl: 'modules/gigs/client/views/wizard/step-six.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('dash.talents', {
        abstract: true,
        url: '',
        template: '<ui-view/>',
      })
      .state('dash.talents.edit', {
        url: '/talents/edit',
        templateUrl: 'modules/talents/client/views/edit-talent.client.view.html',
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
      .state('dash.settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('dash.settings.info', {
        url: '/info',
        templateUrl: 'modules/users/client/views/settings/edit-info.client.view.html'
      })
      .state('dash.settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('dash.settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('dash.settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('dash.settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
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

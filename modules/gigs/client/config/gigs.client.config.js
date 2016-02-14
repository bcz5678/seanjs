'use strict';

// Configuring the Gigs module
angular.module('gigs').run(['Menus',
  function(Menus) {
    // Add the gigs dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Gigs',
      state: 'gigs',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'gigs', {
      title: 'List Gigs',
      state: 'gigs.list',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'gigs', {
      title: 'Create Gigs',
      state: 'gigs.create',
      roles: ['user']
    });
  }
]);
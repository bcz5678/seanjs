'use strict';

// Configuring the Resources module
angular.module('resources').run(['Menus',
  function(Menus) {
    // Add the resources dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Resources',
      state: 'resources',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'resources', {
      title: 'Create Resource',
      state: 'resources.create',
      roles: ['user']
    });+

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'resources', {
      title: 'Manage Resources',
      state: 'resources.edit',
      roles: ['user']
    });
  }
]);
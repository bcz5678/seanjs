'use strict';
 
// Configuring the talents module
angular.module('talents').run(['Menus',
  function(Menus) {
    // Add the talents dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Profile',
      state: 'talents',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'talents', {
      title: 'Start Your Profile',
      state: 'talents.create',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'talents', {
      title: 'Edit Profile',
      state: 'talents.edit',
      roles: ['user']
    });
  }
]);
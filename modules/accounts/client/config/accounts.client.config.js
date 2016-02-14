'use strict';
 
// Configuring the Accounts module
angular.module('accounts').run(['Menus',
  function(Menus) {
    // Add the accounts dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Profile',
      state: 'accounts',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'accounts', {
      title: 'Create Profile',
      state: 'accounts.create',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'accounts', {
      title: 'Edit Profile',
      state: 'accounts.edit',
      roles: ['user']
    });
  }
]);
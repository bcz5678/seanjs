'use strict';

describe('Accounts E2E Tests:', function() {
  describe('Test accounts page', function() {
    it('Should report missing credentials', function() {
      browser.get('http://localhost:3000/accounts');
      expect(element.all(by.repeater('account in accounts')).count()).toEqual(0);
    });
  });
});
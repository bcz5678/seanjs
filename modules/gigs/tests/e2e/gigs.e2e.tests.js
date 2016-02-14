'use strict';

describe('Gigs E2E Tests:', function() {
  describe('Test gigs page', function() {
    it('Should report missing credentials', function() {
      browser.get('http://localhost:3000/gigs');
      expect(element.all(by.repeater('gig in gigs')).count()).toEqual(0);
    });
  });
});
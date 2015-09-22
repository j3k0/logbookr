var expect = require('expect.js');
var tr = require('../src/tr');

describe('tr()', function () {
  // Return tr.locale to its original state.
  (function () {
      var original = tr.locale;
      after(function () {
        tr.locale = original;
      });
  }());

  it('returns `en` translations', function () {
    tr.locale = 'en';
    expect(tr('_test')).to.be('test string');
  });

  it('returns `fr` translations', function () {
    tr.locale = 'fr';
    expect(tr('_test')).to.be('fr test string');
  });

  it('warns about missing locales', function () {
    tr.locale = 'missing';
    expect(tr('_test')).to.match(/^\[No Locale\]/);
  });

  it('warns about missing keys', function () {
    tr.locale = 'en';
    expect(tr('missing')).to.match(/^\[No Translation\]/);
  });
});

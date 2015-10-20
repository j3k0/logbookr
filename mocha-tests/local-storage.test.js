var expect = require('expect.js');
var converters = require('../src/local-storage/converters');
var config = require('../src/local-storage/config');
var legacy = require('./legacy-data');

describe('LocalStorage', function () {
  describe('converters', function () {
    describe('.startsWith', function () {
      it('returns true if string starts with beginning', function () {
        expect(converters.startsWith('xxxyyy', 'x')).to.be(true)
        expect(converters.startsWith('', '')).to.be(true);
      });

      it('returns false otherwise', function () {
        expect(converters.startsWith('xxxyyy', 'yy')).to.be(false);
        expect(converters.startsWith('xxxyyy', 'xxxyyy ')).to.be(false);
      });
    });

    describe('.shouldConvert()', function () {
      var fn = converters.shouldConvert;

      it('returns true on keys that are not prefixed with `config.dataPrefix`', function () {
        expect(fn('some-key')).to.be(true);
        expect(fn('')).to.be(true);
      });

      it('returns false on safekeep keys', function () {
        expect(fn(config.safekeepPrefix + 'some-key')).to.be(false);
      });

      it('returns false otherwise', function () {
        expect(fn(config.dataPrefix + 'some-key')).to.be(false);
      });
    });

    describe('.convert()', function () {
      describe('returns an object', function () {
        var key = 'the-key';
        var item = '{"the": "item"}';
        var converted = converters.convert(key, item);

        it('has only requried keys', function () {
          expect(converted).to.only.have.keys('key', 'item', 'safekeepKey', 'safekeepItem');
        });

        it('all values are strings, null is allowed as item', function () {
          expect(Object.keys(converted).every(function (key) {
            if (typeof converted[key] === 'string')
              return true;

            return (key === 'item') && (converted[key] === null);
          })).to.be(true);
        });

        it('keys are correctly prefixed', function () {
          expect(converters.startsWith(converted.key, config.dataPrefix)).to.be(true);
          expect(converters.startsWith(converted.safekeepKey, config.dataPrefix)).to.be(true);
          expect(converters.startsWith(converted.safekeepKey, config.safekeepPrefix)).to.be(true);
        });

        it('`key` is dataPrefix + key', function () {
          expect(converted.key).to.be(config.dataPrefix + key);
        })

        it('`safekeepKey` is safekeepPrefix + key', function () {
          expect(converted.safekeepKey).to.be(config.safekeepPrefix + key);
        });

        it('`safekeepItem` is the same as original', function () {
          expect(converted.safekeepItem).to.be(item);
        });
      });

      describe('correctly converts…', function () {
        var convertLegacy = function (what) {
          return converters.convert(legacy[what].key, legacy[what].item);
        };

        it('ChTr', function () {
          var converted = convertLegacy('ChTr');
          expect(converted.item).to.be(legacy.ChTr.item);
        });

        it('ChTr-{id}', function () {
          var converted = convertLegacy('ChTrItem');
          expect(converted.item).to.be(legacy.ChTrItem.item);
        });

        it('Procs', function () {
          var converted = convertLegacy('Procs');
          expect(converted.item).to.be(legacy.Procs.item);
        });

        it('Procs-{id}', function () {
          legacy.ProcsItem.forEach(function (legacyProc) {
            var converted = converters.convert(legacyProc.key, legacyProc.item);
            expect(JSON.parse(converted.item)).to.eql(legacyProc.converted);
          });
        });

        it('returns null as key/item for other types of keys', function () {
          var converted = converters.convert('some-other-key', '');
          expect(converted.item).to.be(null);
        });
      });
    });
  });
});

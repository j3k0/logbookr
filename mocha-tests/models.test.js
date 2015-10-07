var expect = require('expect.js');
var underscore = require('underscore');
var ProcedureModel = require('../src/models/procedureModel');
var FieldModel = require('../src/models/fieldModel');

describe('FieldModel', function () {
  it('exports available field types', function () {
    expect(FieldModel.types).to.have.keys(
      'DATE', 'TEXT', 'TEXTAREA', 'CHOICETREE', 'PHOTOS'
    );
  });

  it('has `name`, `type`, `description`', function () {
    var field = new FieldModel();
    expect(field.attributes).to.have.keys('name', 'type', 'description');
  });

  it('`type` defaults to TEXT', function () {
    expect(new FieldModel().get('type')).to.be(FieldModel.types.TEXT);
  });

  describe('#validate()', function () {
    it('`type` must be one of FieldModel.types', function () {
      var invalidType = new FieldModel({type: 'not-a-type'});
      expect(invalidType.isValid()).to.be(false);
      expect(invalidType.validationError).to.match(/^ValidationError: `type` must be one of/);
    });

    it('`name` must be non-empty string', function () {
      var field = new FieldModel();
      expect(field.isValid()).to.be(false);
      expect(field.validationError).to.match(/^ValidationError: `name` must be non-empty string/);
    });

    it('returns undefined on well-formed fields', function () {
      var field = new FieldModel({name: 'name'});
      expect(field.isValid()).to.be(true);
    });
  });

  describe('#defaultValue()', function () {
    it('empty array for PHOTOS', function () {
      var field = new FieldModel({type: FieldModel.types.PHOTOS});
      expect(field.defaultValue()).to.be.an(Array);
      expect(field.defaultValue()).to.have.length(0);
    });

    it('empty string for other types', function () {
      var field = new FieldModel();
      expect(field.defaultValue()).to.be('');
    });
  });
});

describe('ProcedureModel', function () {
  var createProcedure = function (customAttributes, options) {
    var defaults = {
      id: 'id',
      date: 'date',
      type: 'type',
      patient: 'patient'
    };

    var attrs = underscore.extend(defaults, customAttributes || {})
    return new ProcedureModel(attrs, options);
  };


  describe('defaults() / initialize()', function () {
    it('defines meta info: `id`, `createdAt`, `requiredFields` and `fields`', function () {
      var procedure = new ProcedureModel();
      expect(procedure.attributes).to.have.keys(
        'id', 'createdAt', 'requiredFields', 'fields'
      );
    });

    it('each required field has an according model attribute', function () {
      var procedure = new ProcedureModel();
      var names = procedure.get('requiredFields').map(function (field) { return field.name; });
      expect(procedure.attributes).to.have.keys(names);
    });

    it('when no options.template is specified, attribute `fields` is an emtpy array', function () {
      expect(new ProcedureModel().get('fields')).to.eql([]);
      expect(new ProcedureModel({}, {}).get('fields')).to.eql([]);
      expect(new ProcedureModel({}, {template: {notinstanceof: 'Array'}}).get('fields')).to.eql([]);
    });

    it('when options.template is specified, copies over fields from ' +
       'options.template.get(\'fields\') to `fields` attribute', function () {
      // Somehow we got our hands on JSON of tempalte fields, in real app terms:
      //   var template = template.getInstance().toJSON();

      var template = [
        {name: 'some-field', description: 'very-descriptive', type: 'text'},
        {name: 'other-field', description: 'even-more-descriptive', type: 'date'},
        {name: 'ok', description: 'nice', type: 'photos'}
      ];

      var procedure = new ProcedureModel(undefined, {template: template});

      // Make sure it is copy and not the same reference.
      expect(procedure.get('fields')).to.not.be(template);
      expect(procedure.get('fields')).to.eql(template);

      // Make sure we defined attributes according to field names.
      template.forEach(function (field) {
        expect(procedure.get(field.name)).to.eql(new FieldModel(field).defaultValue());
      });
    });

    describe('#clone()', function () {
      it('returns new instance with deep cloned attributes', function () {
        var obj = {answer: 42};
        var array = [obj];
        var procedure = new ProcedureModel({array: array});
        var clone = procedure.clone();

        // Same references
        expect(procedure.get('array')).to.be(array);
        expect(procedure.get('array')[0]).to.be(obj);
        // Different references, still equal contents.
        expect(clone).to.be.a(ProcedureModel);
        expect(clone.get('array')).to.eql(array);
        expect(clone.get('array')).not.to.be(array);
        expect(clone.get('array')[0]).not.to.be(obj);
      });
    });

    describe('#diff()', function () {
      it('returns set of changes required to revert model to its previous state', function () {
        var procedure = new ProcedureModel();
        var changes = {
          patient: 'someone',  // change field
          new: 'attr'          // add field
        };

        procedure.set(changes)
        var expectedDiff = underscore.pick(procedure.previousAttributes(), Object.keys(changes));
        expect(procedure.diff()).to.eql(expectedDiff);
      });

      it('returns `false` when model is unchagned compared to its previous state', function () {
        var procedure = new ProcedureModel();
        expect(procedure.diff()).to.eql(false);
      });
    });

    describe('#revert()', function () {
      it('returns model to its previous state (before latest `set()`)', function () {
        var procedure = new ProcedureModel();
        var original = procedure.toJSON();

        procedure.set('patient', 'must be reverted');
        procedure.revert();

        expect(original).to.eql(procedure.toJSON());
      });

      it('does nothing if model was not changed', function () {
        var ts = Date.now();
        var procedure = createProcedure({createdAt: ts});
        procedure.revert();

        expect(procedure.diff()).to.be(false);
        expect(procedure.toJSON()).to.eql(createProcedure({createdAt: ts}).toJSON());
      });
    });

    describe('#safeSet()', function () {
      it('applies changes and returns true', function () {
        var procedure = createProcedure();
        expect(procedure.safeSet({patient: 'someone else'})).to.be(true);
        expect(procedure.get('patient')).to.be('someone else');
      });

      it('preserves model.validationError', function () {
        var procedure = createProcedure();
        procedure.safeSet({patient: ''});

        var backboneValidatedProcedure = createProcedure();
        backboneValidatedProcedure.set('patient', '');
        backboneValidatedProcedure.isValid();

        expect(procedure.validationError).to.eql(backboneValidatedProcedure.validationError);
      });

      it('returns false and reverts changes if, when applied, resulted in invalid model', function () {
        var procedure = createProcedure();
        expect(procedure.safeSet({patient: ''})).to.be(false);
        expect(procedure.get('patient')).to.be(createProcedure().get('patient'));
      });

      it('throws Error if changes argument is incorrect', function () {
        var procedure = createProcedure();
        var fn = procedure.safeSet.bind(procedure);
        expect(fn).withArgs().to.throwError(/^InvalidChanges$/);
        expect(fn).withArgs(undefined).to.throwError(/^InvalidChanges$/);
        expect(fn).withArgs(null).to.throwError(/^InvalidChanges$/);
        expect(fn).withArgs(new Number(42)).to.throwError(/^InvalidChanges$/);
        expect(fn).withArgs({}).to.throwError(/^InvalidChanges$/);
      });
    });

    describe('#fieldInfo()', function () {
      var myField = {
        name: 'my-field',
        description: 'my-description',
        type: FieldModel.types.TEXT
      };

      it('returns field info by its name', function () {
        var procedure = createProcedure(undefined, {template: [myField]});
        expect(procedure.fieldInfo(myField.name)).to.eql(myField)
      });

      it('returns undefined if fields was not found', function () {
        var procedure = createProcedure();
        expect(procedure.fieldInfo(myField.name)).to.be(undefined);
      });
    });
  });
});

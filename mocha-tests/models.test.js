var expect = require('expect.js');
var ProcedureModel = require('../src/models/procedureModel');
var FieldModel = require('../src/models/fieldModel');
var FieldsCollection = require('../src/models/fieldsCollection');

describe('FieldModel', function () {
  it('exports available field types', function () {
    expect(FieldModel.types).to.have.keys(
      'DATE', 'TEXT', 'TEXTAREA', 'CHOICETREE'
    );
  });

  it('has `name`, `type`, `description`', function () {
    var field = new FieldModel();
    expect(field.attributes).to.have.keys('name', 'type', 'description');
  });

  describe('#validate()', function () {
    it('returns error message on invalid type', function () {
      var emptyType = new FieldModel();
      expect(emptyType.isValid()).to.be(false);
      expect(emptyType.validationError).to.match(/^InvalidAttribute:/);

      var invalidType = new FieldModel({type: 'not-a-type'});
      expect(invalidType.isValid()).to.be(false);
      expect(invalidType.validationError).to.match(/^InvalidAttribute:/);
    });

    it('returns undefined on well-formed fields', function () {
      var field = new FieldModel({type: FieldModel.types.TEXT});
      expect(field.isValid()).to.be(true);
    });
  });
});

describe('ProcedureModel', function () {
  describe('defaults() / initialize()', function () {
    it('defines minimal set of properties: `id`, `name`, `procedure`, `date`', function () {
      var procedure = new ProcedureModel();
      expect(procedure.attributes).to.have.keys(
        'id', 'name', 'procedure', 'date'
      );
    });

    it('copies description of additional fields into `fields` attribute' +
       'as a backbone.Collection of FieldModel instances.', function () {
      var procedure = new ProcedureModel();
      expect(procedure.get('fields')).to.be.a(FieldsCollection);
    });

    it('initialize() does not overwrite attributes provided to ctor', function () {
      var procedure = new ProcedureModel({comment: 'some comment'});
      expect(procedure.get('comment')).to.be('some comment');
    });
  });

  it('has every field mentioned in model.fields as an attribute', function () {
    var procedure = new ProcedureModel();
    expect(procedure.get('fields').every(function (field) {
      return procedure.has(field.get('name'));
    })).to.be(true);
  });
});

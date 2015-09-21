var expect = require('expect.js');
var ProcedureModel = require('../src/models/procedureModel');
var FieldModel = require('../src/models/fieldModel');

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

  it('`type` defaults to TEXT', function () {
    expect(new FieldModel().get('type')).to.be(FieldModel.types.TEXT);
  });

  describe('#validate()', function () {
    it('returns error message on invalid type', function () {
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
        {name: 'ok', description: 'nice', type: 'text'}
      ];

      var procedure = new ProcedureModel(undefined, {template: template});

      // Make sure it is copy and not the same reference.
      expect(procedure.get('fields')).to.not.be(template);
      expect(procedure.get('fields')).to.eql(template);
    });
  });
});

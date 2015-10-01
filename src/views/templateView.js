(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var $ = require('jquery');
    var backbone = require('backbone');
    var underscore = require('underscore');
    var templateText = require('./text!./templateView.html');
    var FieldModel = require('../models/FieldModel');
    var uuid = require('../models/uuid');
    var tr = require('../tr');
    var alerts = require('../alerts');

    return backbone.View.extend({
      template: underscore.template(templateText),

      initialize: function (options) {
        this.options = options || {};
        options.viewName = 'Template';

        this.goBack = options.goBack;
        this.updateTitle = options.updateTitle;

        this.collection.on('change update', this.render, this);
      },

      events: {
        'click .add-field': 'addField',
        'click .remove-field': 'removeField',
        'change .template-input': 'fieldChanged'
      },

      html: function () {
        return this.template({
          FieldModel: FieldModel,
          fields: this.collection.toJSON(),
          collection: this.collection,
          tr: tr
        });
      },

      render: function () {
        this.titleView = tr('template.title');
        this.updateTitle(this.titleView);
        this.$el.html(this.html());
        return this;
      },

      _fieldBlock: function (event) {
        return $(event.target).parents('.template-field');
      },

      _fieldId: function (event) {
        return this._fieldBlock(event).data('id');
      },

      _field: function (event) {
        return this.collection.get(this._fieldId(event));
      },

      addField: function (event) {
        event.preventDefault();
        var field = new FieldModel({
          name: ['template-field', Date.now(), uuid()].join('.')
        });
        this.collection.add(field);
        field.save();
      },

      removeField: function (event) {
        event.preventDefault();
        event.stopPropagation();

        var self = this;
        alerts.confirm('removeField', function (confirmed) {
          if (confirmed) {
            self._field(event).destroy();
          }
        });
      },

      fieldChanged: function (event) {
        event.preventDefault();
        event.stopPropagation();

        var $li = this._fieldBlock(event);
        var field =  this._field(event);
        var attrs = {
          description: $li.find(".field-description").val(),
          type: $li.find('.field-type').val()
        };

        if (attrs.type === FieldModel.types.CHOICETREE) {
          // For ChoiceTree fields, try to restore their name based on description.
          var restorableName = this.collection.descriptionToName(attrs.description);
          if (restorableName)
            attrs.name = restorableName;
          else
            this.collection.setDescriptionToName(attrs.description, field.get('name'));
        }
        else if (field.get('type') === FieldModel.types.CHOICETREE) {
          // If we are changing field's type from choicetree to something else,
          // we probably would like to revert its name, so it won't conflict
          // with possibly adding same-description choicetree field.
          //
          // TODO:
          // do we need this?
        }

        field.save(attrs);
      }
    });
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));

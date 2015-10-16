(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var $ = require('jquery');
    var backbone = require('backbone');
    var underscore = require('underscore');
    var templateText = require('./text!./templateEditView.html');
    var FieldModel = require('../models/FieldModel');
    var uuid = require('../models/uuid');
    var tr = require('../tr');
    var alerts = require('../alerts');
    var errors = require('../errors');

    return backbone.View.extend({
      template: underscore.template(templateText),

      _initializeOriginal: function () {
        this.original = JSON.parse(JSON.stringify(this.collection.toJSON()));
      },

      initialize: function (options) {
        this.options = options || {};
        options.viewName = 'Template';

        this.goBack = options.goBack;
        this.updateTitle = options.updateTitle;
        this.collection.on('change update', this.render, this);

        this._initializeOriginal();
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
        var $descriptionInput = $li.find(".field-description");
        var field =  this._field(event);
        var attrs = {
          description: $descriptionInput.val(),
          type: $li.find('.field-type').val()
        };

        // Don't bother with empty descriptions
        if (attrs.description) {
          // Check that description is unique.
          var otherFieldHasSameDescription = this.collection.some(function (model) {
            return model.id !== field.id
              ? model.get('description') === attrs.description
              : false;
          });

          if (otherFieldHasSameDescription) {
            var error = errors.duplicateError('Each field must have an unique description.');
            $descriptionInput.select().focus();
            return alerts.error(error);
          }

          // Let's find out whether we had field with this description before.
          // If we did, set its name to what it use to be.
          // If we didn't, save it.
          var restorableName = this.collection.descriptionToName(attrs.description);
          if (restorableName)
            attrs.name = restorableName;
          else
            this.collection.setDescriptionToName(attrs.description, field.get('name'));
        }

        field.save(attrs);
      },

      hasUnsavedChanges: function () {
        if (this.original.length !== this.collection.length)
          return true;

        return this.original.some(function (fieldJson, idx) {
          var field = this.collection.at(idx);
          var diff = field.changedAttributes(fieldJson);
          return false !== diff;
        }, this);
      },

      dataSave: function () {
        this._initializeOriginal();
        return true;
      },

      dataDiscard: function () {
        this._dataRemove();
        this.original.forEach(function (fieldJson) {
          var field = new FieldModel(fieldJson)
          this.collection.add(field);
          field.save();
        }, this);
      },

      _dataRemove: function () {
        var field;
        while (field = this.collection.first()) { // eslint-disable-line no-cond-assign
          field.destroy();
        }
      },

      dataRemove: function (callback) {
        var self = this;
        alerts.confirm('removeTemplate', function (confirmed) {
            if (confirmed) {
                self._dataRemove();
                self._initializeOriginal();
                callback();
            }
        });
      }
    });
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));

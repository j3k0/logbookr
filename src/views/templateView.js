(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var $ = require('jquery');
    var backbone = require('backbone');
    var underscore = require('underscore');
    var templateText = require('./text!./templateView.html');
    var FieldModel = require('../models/FieldModel');

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
        'click .save-field': 'saveField',
        'click .remove-field': 'removeField'
      },

      html: function () {
        return this.template({
          FieldModel: FieldModel,
          fields: this.collection.toJSON(),
          collection: this.collection
        });
      },

      render: function () {
        this.titleView = "Template Editor";
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
          name: 'name-' + String(Date.now()).slice(-5),
          description: 'desc-' + String(Date.now()).slice(-5)
        });
        this.collection.add(field);
        field.save();
      },

      saveField: function (event) {
        event.preventDefault();
        var $li = this._fieldBlock(event);

        this._field(event).save({
          name: $li.find(".field-name").val(),
          description: $li.find(".field-description").val(),
          type: $li.find('.field-type').val()
        });
      },

      removeField: function (event) {
        event.preventDefault();
        this._field(event).destroy();
      }
    });
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));

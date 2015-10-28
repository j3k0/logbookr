// Idea here is to have two views and allow to alternate between them.
// One is for displaying data, one for editing it.
//
// editView must have:
//  - #hasUnsavedChanges() method that returns true if data has been changed, but not saved yet;
//  - #dataSave() method that applies changes and returns `true` on success;
//  - #dataDiscard() method that reverts any changes made;
//  - #dataRemove(callback) method that removes entry and calls `callback` on success.

(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var backbone = require('backbone');
    var underscore = require('underscore');
    var ProcedureModel = require('../models/procedureModel');
    var templateText = require('./text!./editableView.html');
    var tr = require('../tr');
    var debug = require('../debug');
    var alerts = require('../alerts');

    var EditableView = backbone.View.extend({
      template: underscore.template(templateText),

      initialize: function (options) {
        this.goBack = options.goBack;

        this.mode = options.mode || EditableView.modes.DEFAULT;
        this.showView = options.showView;
        this.editView = options.editView;
      },

      render: function () {
        this.$el.html(this.template({
          modes: EditableView.modes,
          tr: tr
        }));

        this.$controls = this.$('.controls');
        this.$showControls = this.showView.$controls = this.$('.control-show');
        this.$editControls = this.editView.$controls = this.$('.control-edit');

        this.$data = this.$('.data');
        this.showView.setElement(this.$data);
        this.editView.setElement(this.$data);

        this.renderMode();
        return this;
      },

      // Display appropriate controls and render view.
      renderMode: function () {
        var view = undefined;

        [this.showView, this.editView].forEach(function (view) {
          view.undelegateEvents();
          view.$controls.hide();
        });

        switch (this.mode) {
          case EditableView.modes.SHOW:
            view = this.showView;
            break;

          case EditableView.modes.EDIT:
            view = this.editView;
            break;

          default:
            debug.warn('EditableView: uknown mode `%s`.', this.mode);
            break;
        }

        view.render();
        view.delegateEvents();
        view.$controls.show();
        if (this.mode == EditableView.modes.EDIT)
          this.$controls.addClass("editmode");
        else
          this.$controls.removeClass("editmode");
        return this;
      },

      dataSwap: function (model, mode) {
        this.mode = mode || EditableView.modes.DEFAULT;

        [this.showView, this.editView].forEach(function (view) {
          if (view.dataSwap instanceof Function)
            view.dataSwap(model);
          else
            view.model = model;
        });
      },

      events: {
        'click .edit': 'onEdit',
        'click .remove': 'onRemove',
        'click .discard': 'onDiscard',
        'click .save': 'onSave'
      },

      _toggleMode: function (mode) {
        this.mode = mode;
        this.renderMode();
      },

      onEdit: function (/*event*/) {
        this._toggleMode(EditableView.modes.EDIT);
      },

      onRemove: function (/*event*/) {
        this.editView.dataRemove(this.goBack);
      },

      onDiscard: function (/*event*/) {
        var self = this;

        // After we confirmed discarding changes, do different things based on
        // whether we were creating new procedure or editing existing one.
        var whenDiscared = function (creatingNewProcedure) {
          return creatingNewProcedure
            ? this.goBack()
            : this._toggleMode(EditableView.modes.SHOW);
        }.bind(self, self.editView.original && self.editView.original instanceof ProcedureModel && !self.editView.original.collection);

        if (!self.editView.hasUnsavedChanges())
          return whenDiscared();

        alerts.confirm('unsavedChanges', function (confirmed) {
          if (confirmed) {
            self.editView.dataDiscard();
            whenDiscared();
          }
        });
      },

      onSave: function (/*event*/) {
        if (this.editView.dataSave())
          this._toggleMode(EditableView.modes.SHOW);
      }
    },

    {
      modes: {
        SHOW: 'show',
        EDIT: 'edit',

        DEFAULT: 'show'
      }
    });

    return EditableView;
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));

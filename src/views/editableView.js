// Idea here is to have two views and allow to alternate between them.
// One is for displaying data, one for editing it.
//
// editView must have:
//  - #hasUnsavedChanges() method that returns true if data has been changed, but not saved yet;
//  - #save() method that applies changes and returns `true` on success;
//  - #remove(callback) method that removes entry and calls `callback` on success.

(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var $ = require('jquery');
    var backbone = require('backbone');
    var underscore = require('underscore');
    var templateText = require('./text!./editableView.html');
    var tr = require('../tr');
    var debug = require('../debug');
    var alerts = require('../alerts');

    var EditableView = backbone.View.extend({
      template: underscore.template(templateText),

      initialize: function (options) {
        this._goBack = options.goBack;

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
        return this;
      },

      swapModel: function (model, mode) {
        this.mode = mode || EditableView.modes.DEFAULT;

        [this.showView, this.editView].forEach(function (view) {
          if (view.swapModel instanceof Function)
            view.swapModel(model);
          else
            view.model = model;
        });
      },

      events: {
        'click .control[data-mode]': 'onModeChange',
        'click .save': 'save',
        'click .remove': 'remove'
      },

      toggleMode: function (mode) {
        this.mode = mode;
        this.renderMode();
      },

      onModeChange: function (event) {
        var $control = $(event.target);
        this.toggleMode($control.data('mode'));
      },

      save: function (/*event*/) {
        if (this.editView.save())
          this.toggleMode(EditableView.modes.SHOW);
      },

      remove: function (/*event*/) {
        this.editView.remove(this.goBack);
      },

      goBack: function () {
        return this.editView.hasUnsavedChanges()
          ? alerts.confirm('unsavedChanges', this._goBack)
          : this._goBack();
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

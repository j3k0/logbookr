define(function (require) {
    var $ = require("jquery");
    var _ = require("underscore");
    var template = require("./text!./procedureEditView.html");
    var FieldView = require('./fieldView');
    var FieldModel = require('../models/fieldModel');
    var debug = require('../debug');
    var tr = require('../tr');
    var alerts = require('../alerts');
    var camera = require('../camera');
    require("datetimepicker");
    var ProcedureBaseView = require('./ProcedureBaseView');

    return ProcedureBaseView.extend({

        template: _.template(template),

        initialize: function(options) {
            this.options = options || {};
            this.options.viewName = "ProcedureEditView";

            this.openChoiceTree = options.openChoiceTree;
            this.updateTitle = options.updateTitle;
            this.goBack = options.goBack;
        },

        swapModel: function (procedure) {
            // TODO:
            // not sure this is needed, but it probably is.
            // Look into.
            if (this.model) {
                this.model.off();
                this.model.stopListening();
            }

            this.model = procedure.clone();
            this.original = procedure;

            var self = this;
            this.model.on('change', function () {
                debug('clone changed', self.model.get('id'));
                self.render();
            });
        },

        render: function() {
            var that = this;

            var done = function (documentRoot) {
                var requiredFieldsHtml = FieldView.fieldsHtml(that.model, 'requiredFields', false);
                var fieldsHtml = FieldView.fieldsHtml(that.model, 'fields', false);

                that.$el.html(that.template({
                    procedure: that.model.toJSON(),
                    requiredFieldsHtml: requiredFieldsHtml,
                    fieldsHtml: fieldsHtml,
                    documentRoot: documentRoot,
                    tr: tr
                }));

                that.titleView = tr('procedure.title');
                that.updateTitle(that.titleView);
                that.addDateTimePicker();
            };

            if (window.requestFileSystem) {
                window.requestFileSystem(window.PERSISTENT, 0, function (fs) {
                    done(fs.root.nativeURL);
                });
            }
            else {
                done('.')
            }

            return that;
        },

        events:{
            'click .js-procedure-input': 'inputClicked',
            'change .js-procedure-input': 'inputChanged',

            'click .js-procedure-add-photo': 'addPhoto',
            'click .js-photo-delete': 'deletePhoto',
            'change .js-photo-legend': 'updatePhoto'
        },

        inputClicked: function (event) {
            var self = this;
            var $input = $(event.target);
            var fieldType = $input.data('attribute-type');
            var processedHere = true;
            debug('input ' + event.target + ' (`' + fieldType + '`) clicked.');

            switch (fieldType) {
                case FieldModel.types.CHOICETREE:
                    self.openChoiceTree($input.data('attribute-name'), function (value) {
                        $input.val(value).change();
                    });
                    break;
                default:
                    processedHere = false;
                    break;
            }

            if (processedHere) {
                event.preventDefault();
                event.stopPropagation();
            }
        },

        inputChanged: function (event) {
            event.preventDefault();
            event.stopPropagation();
            var $input = $(event.target);
            this.model.set($input.data('attribute-name'), $input.val());
        },

        addDateTimePicker: function() {
          var defaultDate;
          if(this.model.get('date')) {
            defaultDate = new Date(this.model.get('date'));
          }
          else {
            defaultDate = new Date();
          }
          var that = this;
          var $dtBox = $('<div />');
          this.$el.append($dtBox);
          var options = _.extend({
            mode: 'datetime',
            parentElement: this.el,
            animationDuration: 0,
            shortDayNames: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
            fullDayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
            shortMonthNames: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
            fullMonthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
            //dateTimeSeparator: " &agrave; ",
            //timeSeparator: "h",
            titleContentDate: "Date",
            titleContentTime: "Heure",
            setButtonContent: 'Valider', // '&#x2713;'
            clearButtonContent: 'Annuler', // '&#x2717;'
            titleContentDateTime: "Date et heure de l'intervention",
            defaultDate: defaultDate,
            addEventHandlers: function() {
              that.dtPickerObj = this;
              that.$('.procedure-input[data-attribute-type="' + FieldModel.types.DATE + '"]')
                // TODO:
                // not sure if `off` is required, since we might do stuff
                // when date input is clicked within .inputClicked event handler.
                .off("click")
                .off("focus")
                .click(function(e) {
                    if (e.preventDefault) {
                      e.preventDefault();
                    }
                    if (e.stopPropagation) {
                      e.stopPropagation();
                    }
                    $("#main").scrollTop(0);
                    setTimeout(function() {
                      that.dtPickerObj.showDateTimePicker($(e.target));
                    }, 30);
                  });
            }
          });
          $dtBox.DateTimePicker(options);
        },

        hasUnsavedChanges: function () {
            var diff = this.original.changedAttributes(this.model.attributes);
            return diff !== false;
        },

        remove: function (callback) {
            var self = this;
            alerts.confirm('removeProcedure', function (confirmed) {
                if (confirmed) {
                    if (self.original.collection)
                        self.original.destroy();

                    callback();
                }
            });
        },

        save: function () {
            var attrs = this.model.attributes;
            var ok = this.original.safeSet(attrs);

            if (ok) {
                debug('updated model with attrs', attrs, '\n', this.original);
                this.collection.unshift(this.original);
                this.original.save();
            }
            else {
                debug('failed to update model', this.original.validationError);
                alerts.error(this.original.validationError);
            }

            return ok;
        },

        discard: function () {
            this.swapModel(this.original);
        },

        //
        // Photos stuff
        //

        // When clicking on add photo.
        addPhoto: function (event) {
            event.preventDefault();
            event.stopPropagation();

            var self = this;
            var attributeName = $(event.target).data('attribute-name');

            camera.takePicture(function (err, pic) {
                // TODO:
                // handle errors!
                self.model.get(attributeName).push(pic);
                self.model.trigger('change');
            });
        },

        deletePhoto: function (event) {
            event.preventDefault();
            event.stopPropagation();

            var self = this;
            var info = self._photoInfo(event);

            alerts.confirm('removePhoto', function (confirmed) {
                if (confirmed) {
                    self.model.get(info.attributeName).splice(info.index, 1);
                    self.model.trigger('change');
                }
            });
        },

        updatePhoto: function (event) {
            event.preventDefault();
            event.stopPropagation();

            var info = this._photoInfo(event);
            this.model.get(info.attributeName)[info.index].legend = $(event.target).val();
        }
    });
});

define(function (require) {
    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var template = require("./text!./procedureEntryView.html");
    var FieldView = require('./fieldView');
    var FieldModel = require('../models/fieldModel');
    var debug = require('../debug');
    var tr = require('../tr');
    var alerts = require('../alerts');
    var camera = require('../camera');
    require("datetimepicker");

    return Backbone.View.extend({

        template: _.template(template),

        initialize: function(options) {
            this.options = options || {};
            this.options.viewName = "ProcedureEntryView";

            this.openChoiceTree = options.openChoiceTree;
            this.updateTitle = options.updateTitle;
            this.goBack = function () {
                // TODO:
                // this restores models in collection to the state
                // in which they are in local storage, effectively
                // discarding any unsaved changes.
                //
                // Feels very hacky and won't work when changing pages
                // by means other that `< Back` button.
                //
                // Requried since we add photos by pushing into model's array.
                if (this.model.collection)
                    this.model.fetch();
                options.goBack()
            };
        },

        fieldHtml: function (field) {
            var view = new FieldView({
                model: new FieldModel(field),
                value: this.get(field.name)
            });

            return view.html();
        },

        fieldsHtml: function (key) {
            return this.model.get(key)
                .map(this.fieldHtml.bind(this.model))
                .join('\n');
        },

        swapModel: function (procedure) {
            this.model = procedure;
        },

        render: function() {
            var that = this;

            var done = function (documentRoot) {
                var requiredFieldsHtml = that.fieldsHtml('requiredFields');
                var fieldsHtml = that.fieldsHtml('fields');
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
            'click .save-button': 'saveProcedure',
            'click .delete-procedure': 'deleteProcedure',
            // TODO:
            // we can be more specific and don't bind clicks for every input;
            // probably can be moved to FieldView, not sure how, though;
            // w/ever for now.
            'click .procedure-input': 'inputClicked',

            // TODO:
            // Bring pictures back.
            // 'click .take-procedure-picture-btn': 'takePicture',
            // 'click .delete-picture': 'confirmDeletePicture',
            // 'click .procedure-picture-container': 'hidePicture',
            // 'click .procedure-picture-thumbnail': 'showPicture',
            // 'click .edit-button': 'edit'

            'click .js-photo-thumbnail': 'showPhoto',
            'click .js-photo > img': 'hidePhoto',
            'click .js-photo > a': 'deletePhoto'
        },

        inputClicked: function (event) {
            var self = this;
            var $input = $(event.target);
            var fieldType = $input.data('attribute-type');
            var processedHere = true;
            var updateInputValue = $input.val.bind($input);
            debug('input ' + event.target + ' (`' + fieldType + '`) clicked.');

            switch (fieldType) {
                case FieldModel.types.CHOICETREE:
                    self.openChoiceTree($input.data('attribute-name'), updateInputValue);
                    break;
                case FieldModel.types.PHOTOS:
                    camera.takePicture(function (err, pic) {
                        // TODO:
                        // handle errors!

                        // TODO:
                        // instead of updating model we should probably
                        // update some input's value, so we won't have the
                        // situation where model is changed in memory but not
                        // in local storage.
                        //
                        // Not sure how to render in this situation. Probably
                        // some JS on that input's update.
                        self.model.get('photos').push(pic);
                        self.render();
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

        deleteProcedure: function(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            var self = this;
            alerts.confirm('removeProcedure', function (confirmed) {
                if (confirmed) {
                    if (self.model.collection)
                        self.model.destroy();

                    self.goBack();
                }
            });
        },

        saveProcedure: function(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            var attrs = $('input.procedure-input')
                .get()
                .reduce(function (prev, current) {
                    var el = $(current);
                    prev[el.data('attribute-name')] = el.val();
                    return prev;
                }, {});

            // TODO:
            // we can actually have multiple photos fiedls, not just one.
            attrs.photos = $('.procedure-photo')
                .get()
                .map(function (el) {
                    return $(el).data('json');
                });

            var ok = this.model.safeSet(attrs);

            if (ok) {
                debug('updated model with attrs', attrs, '\n', this.model);
                this.collection.unshift(this.model);
                this.model.save();
                this.goBack();
            }
            else {
                debug('failed to update model', this.model.validationError);
                alerts.error(this.model.validationError);
            }
        },

        //
        // Photos stuff
        //

        // Returns index of photo in the photos array.
        _photoInfo: function (event) {
            var $li = $(event.target).parents('.procedure-photo');
            var $block = $li.parents('.procedure-photos');
            var attr = 'photos';

            return {
                attributeName: attr,                     // model attribute with photos aray.
                index: $li.data('idx'),                  // photo's idx in that array.
                photo: $li.data('json'),                 // photo itself
                photoElement: $block.find('.js-photo'),  // where to show full-sized photo.
                elementToDelete: $li                     // this will get deleted, if user asks to.
            };
        },

        showPhoto: function (event) {
            event.preventDefault();
            event.stopPropagation();

            var info = this._photoInfo(event);

            // Update image src/alt.
            $(info.photoElement).find('img').attr({
                src: info.photo.url,
                alt: info.photo.legend
            });

            // Save photo's info so Delete button knows what to delete.
            $(info.photoElement).find('a').data('photo', info.elementToDelete);

            // Show js-photo block for this image.
            info.photoElement.show();
        },

        hidePhoto: function (event) {
            event.preventDefault();
            event.stopPropagation();
            $(event.target).parent().hide();
        },

        deletePhoto: function (event) {
            event.preventDefault();
            event.stopPropagation();
            $(event.target).data('photo').remove();
        }
    });
});

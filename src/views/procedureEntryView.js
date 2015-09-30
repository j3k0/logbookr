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
            this.goBack = options.goBack;
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
            'change .procedure-input': 'inputChanged',

            // TODO:
            // Bring pictures back.
            // 'click .take-procedure-picture-btn': 'takePicture',
            // 'click .delete-picture': 'confirmDeletePicture',
            // 'click .procedure-picture-container': 'hidePicture',
            // 'click .procedure-picture-thumbnail': 'showPicture',
            // 'click .edit-button': 'edit'

            'click .js-photo-thumbnail': 'showPhoto',
            'click .js-photo-image': 'hidePhoto',
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
                case FieldModel.types.PHOTOS:
                    camera.takePicture(function (err, pic) {
                        // TODO:
                        // handle errors!
                        self.model.get('photos').push(pic);
                        self.model.trigger('change');
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

        deleteProcedure: function(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            var self = this;
            alerts.confirm('removeProcedure', function (confirmed) {
                if (confirmed) {
                    if (self.original.collection)
                        self.original.destroy();

                    self.goBack();
                }
            });
        },

        saveProcedure: function(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            var attrs = this.model.attributes;
            var ok = this.original.safeSet(attrs);

            if (ok) {
                debug('updated model with attrs', attrs, '\n', this.original);
                this.collection.unshift(this.original);
                this.original.save();
                this.goBack();
            }
            else {
                debug('failed to update model', this.original.validationError);
                alerts.error(this.original.validationError);
            }
        },

        //
        // Photos stuff
        //

        // When clicking on thumbnail.
        _thumbnailInfo: function (event) {
            var $li = $(event.target).parents('.procedure-photo');
            var $block = $li.parents('.procedure-photos');
            var attributeName = 'photos';  // TODO: do not hardcode this.
            var index = $li.data('index');

            return {
                attributeName: attributeName,                // model attribute with photos aray.
                index: index,                                // photo's index in that array.
                photo: this.model.get(attributeName)[index], // photo itself
                dom: {
                    thumbnail: $li,                // thumbnail element.
                    photo: $block.find('.js-photo') // where to show full-sized photo.
                }
            };
        },

        // When clicking within .js-photo div.
        _photoInfo: function (event) {
            return $(event.target)
                .parents('.js-photo')
                .data();
        },

        // Remove active class from all thumbnails and hide full-sized picture.
        // @domPhotos is .procedure-photo block.
        _deactivateThumbnails: function (domPhotos) {
            domPhotos.find('.procedure-photo').removeClass('active');
            domPhotos.find('.js-photo').hide();
        },

        // Add active class to thumbnail.
        // @thumbnail is .procedure-photo element.
        _activateThumbnail: function (thumbnail) {
            this._deactivateThumbnails(thumbnail.parents('.procedure-photos'));
            thumbnail.addClass('active');
        },

        // When user clicks on the thumbnail, we show full-sized picture
        // with legend and controls that allow to remove it.
        showPhoto: function (event) {
            event.preventDefault();
            event.stopPropagation();

            var info = this._thumbnailInfo(event);

            // Highlight currently selected thumbnail.
            this._activateThumbnail(info.dom.thumbnail);

            // Legend goes into input within jsPhoto.
            info.dom.photo.find('.js-photo-legend').val(info.photo.legend);

            // Picture goes into image within jsPhoto.
            info.dom.photo.find('.js-photo-image').attr({
                src: info.photo.url,
                alt: info.photo.legend
            });

            // We also update jsPhoto's data, so we know which photo
            // is currently selected for updating legend and removing.
            info.dom.photo.data({
                'attributeName': info.attributeName,
                'index': info.index
            });

            // Show js-photo block for this image.
            info.dom.photo.show();
        },

        hidePhoto: function (event) {
            event.preventDefault();
            event.stopPropagation();
            this._deactivateThumbnails($(event.target).parents('.procedure-photos'));
        },

        deletePhoto: function (event) {
            event.preventDefault();
            event.stopPropagation();

            var info = this._photoInfo(event);
            this.model.get(info.attributeName).splice(info.index, 1);
            this.model.trigger('change');
        },

        updatePhoto: function (event) {
            event.preventDefault();
            event.stopPropagation();

            var info = this._photoInfo(event);
            this.model.get(info.attributeName)[info.index].legend = $(event.target).val();
        }
    });
});

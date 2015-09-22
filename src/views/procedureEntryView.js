define(function (require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var template = require("./text!./procedureEntryView.html");
    var DateTimePicker = require("datetimepicker");
    var FieldView = require('./fieldView');
    var FieldModel = require('../models/fieldModel');
    var debug = require('../debug');

    var ProcedureEntryView = Backbone.View.extend({

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
                    documentRoot: documentRoot
                }));

                that.titleView = "Nouvelle intervention";
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
            'click .procedure-input': 'inputClicked'

            // TODO:
            // Bring pictures back.
            // 'click .take-procedure-picture-btn': 'takePicture',
            // 'click .delete-picture': 'confirmDeletePicture',
            // 'click .procedure-picture-container': 'hidePicture',
            // 'click .procedure-picture-thumbnail': 'showPicture',
            // 'click .edit-button': 'edit'
        },

        inputClicked: function (event) {
            var $input = $(event.target);
            var fieldType = $input.data('attribute-type');
            var processedHere = true;
            var updateInputValue = $input.val.bind($input);
            debug(`input ${event.target} (\`${fieldType}\`) clicked.`);

            switch (fieldType) {
                case FieldModel.types.CHOICETREE:
                    this.openChoiceTree($input.data('attribute-name'), updateInputValue);
                    break;
                default:
                    processedHere = false;
                    break;
            }

            if (processedHere) {
                event.preventDefault();
                return false;
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
            if (this.model.collection)
                this.model.destroy();
            this.goBack();
            return false;
        },

        saveProcedure: function(ev) {
            ev.preventDefault();

            var attrs = $('.procedure-input')
                .get()
                .reduce(function (prev, current) {
                    var el = $(current);
                    prev[el.data('attribute-name')] = el.val();
                    return prev;
                }, {});

            // TODO:
            // Validate!
            // if (!attrs.type) {
            //     if (navigator.notification && navigator.notification.alert) {
            //         navigator.notification.alert(
            //             'Veuillez sélectionner le type de l\'intervention',  // message
            //             function (){
            //             },                              // callback to invoke with index of button pressed
            //             'Sauvegarde Impossible',            // title
            //             'Fermer'                        // buttonName
            //         );
            //     }
            //     else {
            //         /*alert('Veuillez sélectionner le type de procédure');*/
            //     }
            //     return false;
            // }

            // Actual save.
            this.model.set(attrs);
            this.collection.unshift(this.model);
            this.model.save();

            debug('saved model with attrs', attrs, '\n', this.model);
            this.goBack();
            return false;
        },

        takePicture: function(ev) {
            ev.preventDefault();
            this.devicePixelRatio = window.devicePixelRatio || 1;
            var that = this;
            if (window.navigator.camera) {
                navigator.camera.getPicture(
                    _(that.onPhotoDataSuccess).bind(that),
                    _(that.onFail).bind(that),
                    {
                        quality: 50,
                        destinationType: Camera.DestinationType.FILE_URI,
                        sourceType : Camera.PictureSourceType.CAMERA,
                        allowEdit: false,
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth:  512,
                        targetHeight: 512,
                        popoverOptions: CameraPopoverOptions,
                        saveToPhotoAlbum: false
                    }
                );
            }
            else {
                if (window.navigator.notification) {
                    navigator.notification.alert(
                        'Aucun appareil photo détecté',  // message
                        function (){
                        },                              // callback to invoke with index of button pressed
                        'Prise de photo',               // title
                        'Fermer'                        // buttonName
                    );
                }
            }
            return false;
        },

         // Called when a photo is successfully retrieved
        onPhotoDataSuccess: function(imageURI) {
            var that = this;
            _.defer(function() {
                /*that.$(".responsive-procedure-picture")[0].src = imageURI;
                that.$(".procedure-picture-thumbnail")[0].src = imageURI;
                that.$(".procedure-picture-thumbnail").attr("image-url", imageURI).removeClass("hidden");*/
                that.movePic(imageURI);
            });
        },

        // Called if something bad happens.
        onFail: function(message) {
            if ((message === "has no access to assets") && (device.platform === 'iOS')){
                if (window.navigator.notification) {
                    navigator.notification.alert(
                        "Si l\'appareil photo ne fonctionne pas, veuillez aller dans les \"Réglages\" de votre iPhone/iPad, section \"Confidentialité\", \"Appareil photo\" et autoriser AJCR à utiliser l\'appareil.",  // message
                        function (){
                        },                              // callback to invoke with index of button pressed
                        'Prise de photo',               // title
                        'Fermer'                        // buttonName
                    );
                }
            }
            if ((message !== "Camera cancelled.")  && (message !== 'has no access to assets')){
                if (window.navigator.notification) {
                    navigator.notification.alert(
                        "La photo n'a pas été prise. " + message,  // message
                        function (){
                        },                              // callback to invoke with index of button pressed
                        'Prise de photo',               // title
                        'Fermer'                        // buttonName
                    );
                }
            }
        },

        confirmDeletePicture: function(ev) {
            ev.preventDefault();
            var deleteButton = $(ev.currentTarget);
            var pictureId = deleteButton.parent().attr('pictureId');
            var that = this;
            if (window.navigator.notification) {
                navigator.notification.confirm(
                    'Etes-vous sûr(e) de vouloir effacer l\'image ?',  // message
                    function (buttonIndex){
                        if (buttonIndex === 2) {
                            that.deletePicture(pictureId);
                        }
                    },                          // callback to invoke with index of button pressed
                    'Confirmation',             // title
                    'Annuler,Effacer'           // buttonLabels
                );
            }
            else {
                that.deletePicture(pictureId);
            }

        },

        deletePicture: function(pictureId) {
            debug(pictureId);
            this.$(".one-picture[pictureId='"+pictureId+"']" ).remove();
        },

        hidePicture: function(ev) {
            ev.preventDefault();
            var picture = this.$(".procedure-picture-container");
            if (!picture.hasClass("hidden")) {
                picture.addClass("hidden");
                this.$(".content").removeClass("hidden");
                $("#tab-content").scrollTop(10000);
            }
        },

        showPicture: function(ev) {
            ev.preventDefault();
            var picture = this.$(".procedure-picture-container");
            picture[0].src = this.$('.procedure-picture-thumbnail').attr("image-url");
            if (picture.hasClass("hidden")) {
                picture.removeClass("hidden");
                this.$(".content").addClass("hidden");
            }
        },

        movePic: function(file){
            window.resolveLocalFileSystemURL(file,
                _(this.resolveOnSuccess).bind(this),
                _(this.resOnError).bind(this));
        },

        //Callback function when the file system uri has been resolved
        resolveOnSuccess: function(entry){
            var that = this;
            debug("resolve success");
            var n = +new Date();
            //new file name
            var newFileName = n + ".jpg";
            var myFolderApp = "AJCR";

            setTimeout(function() {
                debug("requesting a file system.");
                window.requestFileSystem(window.PERSISTENT, 0, function(fileSys) {
                    debug("requestFileSystem success: URL=" + fileSys.root.nativeURL);
                    //The folder is created if doesn't exist
                    fileSys.root.getDirectory(myFolderApp, {
                        create:true, exclusive: false
                    }, function(directory) {
                        debug("getDirectory success: URL=" + directory.nativeURL);
                        entry.moveTo(directory, newFileName,
                            _.bind(that.successMove, that),
                            _.bind(that.resOnError, that));
                    },
                    _.bind(that.resOnError, that));
                },
                _.bind(that.resOnError, that));
            }, 0);
        },

        //Callback function when the file has been moved successfully - inserting the complete path
        successMove: function(entry) {
            debug("move success: URL=" + entry.nativeURL);
            var imgNativeURL = "" + entry.nativeURL;
            this.$(".responsive-procedure-picture")[0].src = imgNativeURL;
            this.$(".procedure-picture-thumbnail")[0].src = imgNativeURL;
            this.$(".procedure-picture-thumbnail").attr("image-url", entry.fullPath).removeClass("hidden");
        },

        resOnError: function(error) {
            debug("Error");
            debug(error.code);
        },

        edit: function(ev) {
            ev.preventDefault();
            var editButton = this.$(".nav-bar .edit-button");
            if(editButton.hasClass("edit-mode")){
                editButton.removeClass("edit-mode");
                editButton.addClass("done-mode");
                editButton.html("Terminer");
                this.$(".procedure-description .delete-icon").removeClass("hidden");
                this.$(".procedure-description").addClass("procedure-description-editable");
            }
            else {
                editButton.removeClass("done-mode");
                editButton.addClass("edit-mode");
                editButton.html("Editer");
                this.$(".procedure-description .delete-icon").addClass("hidden");
                this.$(".procedure-description").removeClass("procedure-description-editable");
            }
            return false;
        }
    });

    return ProcedureEntryView;
});

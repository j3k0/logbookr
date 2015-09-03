define(function (require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var template = require("./text!./procedureEntryView.html");
    var DateTimePicker = require("datetimepicker");
    
    var ProcedureEntryView = Backbone.View.extend({

        template: _.template(template),

        initialize: function(options) {
            this.options = options || {};
            this.options.viewName = "ProcedureEntryView";

            this.openSupervision = options.openSupervision;
            this.openProcedure = options.openProcedure;
            this.openSenior = options.openSenior;
            this.openStage = options.openStage;
            this.updateTitle = options.updateTitle;
            this.goBack = options.goBack;
        },
        
        render: function() {
            var that = this;
            if (window.requestFileSystem) {
                window.requestFileSystem(window.PERSISTENT, 0, function(fileSys) {
                    that.$el.html(that.template({
                        procedure: that.model.toJSON(),
                        documentRoot: fileSys.root.nativeURL
                    }));
                    that.titleView = "Nouvelle intervention";
                    that.updateTitle(that.titleView);
                    that.addDateTimePicker();
                });
            }
            else {
                that.$el.html(that.template({
                    procedure: that.model.toJSON(),
                    documentRoot: "."
                }));
                that.titleView = "Nouvelle intervention";
                that.updateTitle(that.titleView);
                that.addDateTimePicker();
            }
            return this;
        },

        events:{
            'click .save-button': 'saveProcedure',
            'click .delete-procedure': 'deleteProcedure',
            'click .procedure input': 'pickProcedure',
            'click .supervision input': 'pickSupervision',
            'click .senior input': 'pickSenior',
            'click .stage input': 'pickStage',
            'click .take-procedure-picture-btn': 'takePicture',
            'click .delete-picture': 'confirmDeletePicture',
            'click .procedure-picture-container': 'hidePicture',
            'click .procedure-picture-thumbnail': 'showPicture',
            'click .edit-button': 'edit'
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
              that.$(".datetime-input").off("click");
              that.$(".datetime-input").off("focus");
              that.$(".datetime-input").click(function(e) {
                if (e.preventDefault) {
                  e.preventDefault();
                }
                if (e.stopPropagation) {
                  e.stopPropagation();
                }
                $("#main").scrollTop(0);
                setTimeout(function() {
                  that.dtPickerObj.showDateTimePicker(that.$(".datetime-input"));
                }, 30);
              });
            }
          });
          $dtBox.DateTimePicker(options);
        },

        pickProcedure: function(ev) {
            ev.preventDefault();
            var that = this;
            this.openProcedure(function(value) {
                that.$(".procedure-type").val(value);
            });
            return false;
        },

        pickSupervision: function(ev) {
            ev.preventDefault();
            var that = this;
            this.openSupervision(function(value) {
                that.$(".procedure-supervision").val(value);
            });
            return false;
        },

        pickSenior: function(ev) {
            ev.preventDefault();
            var that = this;
            this.openSenior(function(value) {
                that.$(".procedure-senior").val(value);
            });
            return false;
        },

        pickStage: function(ev) {
            ev.preventDefault();
            var that = this;
            this.openStage(function(value) {
                that.$(".procedure-stage").val(value);
            });
            return false;
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
            var attrs = {
                type: this.$('.procedure-type').val(),
                date: this.$('.procedure-datetime').val(),
                patient: this.$('.procedure-patient').val(),
                diagnostic: this.$('.procedure-diagnostic').val(),
                supervision: this.$('.procedure-supervision').val(),
                senior: this.$('.procedure-senior').val(),
                stage: this.$('.procedure-stage').val(),
                comment: this.$('.procedure-comment').val(),
                picture: this.$('.procedure-picture-thumbnail').attr("image-url")
            };
            if (!attrs.type) {
                if (navigator.notification && navigator.notification.alert) {
                    navigator.notification.alert(
                        'Veuillez sélectionner le type de l\'intervention',  // message
                        function (){
                        },                              // callback to invoke with index of button pressed
                        'Sauvegarde Impossible',            // title
                        'Fermer'                        // buttonName
                    );
                }
                else {
                    /*alert('Veuillez sélectionner le type de procédure');*/
                }
                return false;
            }
            this.model.set(attrs);
            this.collection.unshift(this.model);
            this.model.save();
            /*this.model.save(attrs, {
                success: function(response){
                },
                error: function (model, response) {}
            });*/
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
            console.log(pictureId);
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
            console.log("resolve success");
            var n = +new Date();
            //new file name
            var newFileName = n + ".jpg";
            var myFolderApp = "AJCR";

            setTimeout(function() {
                console.log("requesting a file system.");
                window.requestFileSystem(window.PERSISTENT, 0, function(fileSys) {
                    console.log("requestFileSystem success: URL=" + fileSys.root.nativeURL);
                    //The folder is created if doesn't exist
                    fileSys.root.getDirectory(myFolderApp, {
                        create:true, exclusive: false
                    }, function(directory) {
                        console.log("getDirectory success: URL=" + directory.nativeURL);
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
            console.log("move success: URL=" + entry.nativeURL);
            var imgNativeURL = "" + entry.nativeURL;
            this.$(".responsive-procedure-picture")[0].src = imgNativeURL;
            this.$(".procedure-picture-thumbnail")[0].src = imgNativeURL;
            this.$(".procedure-picture-thumbnail").attr("image-url", entry.fullPath).removeClass("hidden");
        },

        resOnError: function(error) {
            console.log("Error");
            console.log(error.code);
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

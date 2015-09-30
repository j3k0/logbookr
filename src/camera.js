(function (root, isBrowser) {
  "use strict";

  // TODO:
  // this module is a lie.

  var definition = function () {
    // Let's wrap camera stuff into callback function, something like:
    //  callback(err, pictrure)
    // picture being {url: '', legend: ''} and error is Error or null

    return {
      takePicture: function (callback) {
        // for now, return no error, random photo
        var photos = [
          { url: 'http://www.newton.ac.uk/files/covers/968361.jpg',
            legend: 'some random picture' },
          { url: 'http://www.miataturbo.net/attachments/insert-bs-here-4/35220d1330303876-random-pictures-thread-sfw-joe-stones-pony-random-shots-059-jpg',
            legend: 'internet is great!' },
          { url: 'http://images4.fanpop.com/image/photos/17600000/Awesome-random-17652989-500-278.jpg',
            legend: 'another masterpice!' },
          { url: 'http://www.hpl.hp.com/research/info_theory/AlbertWeb/fullsize/B)%20Corrupted%20by%20random%20noise,%20bit%20error%20rate%3D0.020.gif',
            legend: 'okay this is a description' }
       ];

        var getRandomInt = function (min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var idx = getRandomInt(0, photos.length - 1);
        var pic = photos[idx];

        // simulate async stuff
        setTimeout(callback.bind(null, null, pic), 200);
      }
    };

        // takePicture: function(ev) {
        //     ev.preventDefault();
        //     ev.stopPropagation();

        //     this.devicePixelRatio = window.devicePixelRatio || 1;
        //     var that = this;
        //     if (window.navigator.camera) {
        //         navigator.camera.getPicture(
        //             _(that.onPhotoDataSuccess).bind(that),
        //             _(that.onFail).bind(that),
        //             {
        //                 quality: 50,
        //                 destinationType: Camera.DestinationType.FILE_URI,
        //                 sourceType : Camera.PictureSourceType.CAMERA,
        //                 allowEdit: false,
        //                 encodingType: Camera.EncodingType.JPEG,
        //                 targetWidth:  512,
        //                 targetHeight: 512,
        //                 popoverOptions: CameraPopoverOptions,
        //                 saveToPhotoAlbum: false
        //             }
        //         );
        //     }
        //     else {
        //         if (window.navigator.notification) {
        //             navigator.notification.alert(
        //                 'Aucun appareil photo détecté',  // message
        //                 function (){
        //                 },                              // callback to invoke with index of button pressed
        //                 'Prise de photo',               // title
        //                 'Fermer'                        // buttonName
        //             );
        //         }
        //     }
        // },

        //  // Called when a photo is successfully retrieved
        // onPhotoDataSuccess: function(imageURI) {
        //     var that = this;
        //     _.defer(function() {
        //         /*that.$(".responsive-procedure-picture")[0].src = imageURI;
        //         that.$(".procedure-picture-thumbnail")[0].src = imageURI;
        //         that.$(".procedure-picture-thumbnail").attr("image-url", imageURI).removeClass("hidden");*/
        //         that.movePic(imageURI);
        //     });
        // },

        // // Called if something bad happens.
        // onFail: function(message) {
        //     if ((message === "has no access to assets") && (device.platform === 'iOS')){
        //         if (window.navigator.notification) {
        //             navigator.notification.alert(
        //                 "Si l\'appareil photo ne fonctionne pas, veuillez aller dans les \"Réglages\" de votre iPhone/iPad, section \"Confidentialité\", \"Appareil photo\" et autoriser AJCR à utiliser l\'appareil.",  // message
        //                 function (){
        //                 },                              // callback to invoke with index of button pressed
        //                 'Prise de photo',               // title
        //                 'Fermer'                        // buttonName
        //             );
        //         }
        //     }
        //     if ((message !== "Camera cancelled.")  && (message !== 'has no access to assets')){
        //         if (window.navigator.notification) {
        //             navigator.notification.alert(
        //                 "La photo n'a pas été prise. " + message,  // message
        //                 function (){
        //                 },                              // callback to invoke with index of button pressed
        //                 'Prise de photo',               // title
        //                 'Fermer'                        // buttonName
        //             );
        //         }
        //     }
        // },

        // confirmDeletePicture: function(ev) {
        //     ev.preventDefault();
        //     var deleteButton = $(ev.currentTarget);
        //     var pictureId = deleteButton.parent().attr('pictureId');
        //     var that = this;
        //     if (window.navigator.notification) {
        //         navigator.notification.confirm(
        //             'Etes-vous sûr(e) de vouloir effacer l\'image ?',  // message
        //             function (buttonIndex){
        //                 if (buttonIndex === 2) {
        //                     that.deletePicture(pictureId);
        //                 }
        //             },                          // callback to invoke with index of button pressed
        //             'Confirmation',             // title
        //             'Annuler,Effacer'           // buttonLabels
        //         );
        //     }
        //     else {
        //         that.deletePicture(pictureId);
        //     }

        // },

        // deletePicture: function(pictureId) {
        //     debug(pictureId);
        //     this.$(".one-picture[pictureId='"+pictureId+"']" ).remove();
        // },

        // hidePicture: function(ev) {
        //     ev.preventDefault();
        //     var picture = this.$(".procedure-picture-container");
        //     if (!picture.hasClass("hidden")) {
        //         picture.addClass("hidden");
        //         this.$(".content").removeClass("hidden");
        //         $("#tab-content").scrollTop(10000);
        //     }
        // },

        // showPicture: function(ev) {
        //     ev.preventDefault();
        //     var picture = this.$(".procedure-picture-container");
        //     picture[0].src = this.$('.procedure-picture-thumbnail').attr("image-url");
        //     if (picture.hasClass("hidden")) {
        //         picture.removeClass("hidden");
        //         this.$(".content").addClass("hidden");
        //     }
        // },

        // movePic: function(file){
        //     window.resolveLocalFileSystemURL(file,
        //         _(this.resolveOnSuccess).bind(this),
        //         _(this.resOnError).bind(this));
        // },

        // //Callback function when the file system uri has been resolved
        // resolveOnSuccess: function(entry){
        //     var that = this;
        //     debug("resolve success");
        //     var n = +new Date();
        //     //new file name
        //     var newFileName = n + ".jpg";
        //     var myFolderApp = "AJCR";

        //     setTimeout(function() {
        //         debug("requesting a file system.");
        //         window.requestFileSystem(window.PERSISTENT, 0, function(fileSys) {
        //             debug("requestFileSystem success: URL=" + fileSys.root.nativeURL);
        //             //The folder is created if doesn't exist
        //             fileSys.root.getDirectory(myFolderApp, {
        //                 create:true, exclusive: false
        //             }, function(directory) {
        //                 debug("getDirectory success: URL=" + directory.nativeURL);
        //                 entry.moveTo(directory, newFileName,
        //                     _.bind(that.successMove, that),
        //                     _.bind(that.resOnError, that));
        //             },
        //             _.bind(that.resOnError, that));
        //         },
        //         _.bind(that.resOnError, that));
        //     }, 0);
        // },

        // //Callback function when the file has been moved successfully - inserting the complete path
        // successMove: function(entry) {
        //     debug("move success: URL=" + entry.nativeURL);
        //     var imgNativeURL = "" + entry.nativeURL;
        //     this.$(".responsive-procedure-picture")[0].src = imgNativeURL;
        //     this.$(".procedure-picture-thumbnail")[0].src = imgNativeURL;
        //     this.$(".procedure-picture-thumbnail").attr("image-url", entry.fullPath).removeClass("hidden");
        // },

        // resOnError: function(error) {
        //     debug("Error");
        //     debug(error.code);
        // },

        // edit: function(ev) {
        //     ev.preventDefault();
        //     ev.stopPropagation();

        //     var editButton = this.$(".nav-bar .edit-button");
        //     if(editButton.hasClass("edit-mode")){
        //         editButton.removeClass("edit-mode");
        //         editButton.addClass("done-mode");
        //         editButton.html("Terminer");
        //         this.$(".procedure-description .delete-icon").removeClass("hidden");
        //         this.$(".procedure-description").addClass("procedure-description-editable");
        //     }
        //     else {
        //         editButton.removeClass("done-mode");
        //         editButton.addClass("edit-mode");
        //         editButton.html("Editer");
        //         this.$(".procedure-description .delete-icon").addClass("hidden");
        //         this.$(".procedure-description").removeClass("procedure-description-editable");
        //     }
        // }
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));

// (function() {
//   // http://lorempixel.com/400/200/cats/
//   var streaming = false,
//       video        = document.querySelector('#video'),
//       canvas       = document.querySelector('#canvas'),
//       photo        = document.querySelector('#photo'),
//       startbutton  = document.querySelector('#startbutton'),
//       width = 320,
//       height = 0;

//   navigator.getMedia = ( navigator.getUserMedia ||
//                          navigator.webkitGetUserMedia ||
//                          navigator.mozGetUserMedia ||
//                          navigator.msGetUserMedia);

//   navigator.getMedia(
//     {
//       video: true,
//       audio: false
//     },
//     function(stream) {
//       if (navigator.mozGetUserMedia) {
//         video.mozSrcObject = stream;
//       } else {
//         var vendorURL = window.URL || window.webkitURL;
//         video.src = vendorURL.createObjectURL(stream);
//       }
//       video.play();
//     },
//     function(err) {
//       console.log("An error occured! " + err);
//     }
//   );

//   video.addEventListener('canplay', function(ev){
//     if (!streaming) {
//       height = video.videoHeight / (video.videoWidth/width);
//       video.setAttribute('width', width);
//       video.setAttribute('height', height);
//       canvas.setAttribute('width', width);
//       canvas.setAttribute('height', height);
//       streaming = true;
//     }
//   }, false);

//   function takepicture() {
//     canvas.width = width;
//     canvas.height = height;
//     canvas.getContext('2d').drawImage(video, 0, 0, width, height);
//     var data = canvas.toDataURL('image/png');
//     photo.setAttribute('src', data);
//   }

//   startbutton.addEventListener('click', function(ev){
//       takepicture();
//     ev.preventDefault();
//   }, false);

// })();

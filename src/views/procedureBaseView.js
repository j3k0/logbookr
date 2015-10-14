(function (root, isBrowser) {
  "use strict";

  var definition = function (require) {
    var $ = require('jquery');
    var backbone = require('backbone');

    return backbone.View.extend({
      // When clicking within .js-photo div.
      _photoInfo: function (event) {
        return $(event.target)
          .parents('.js-photo')
          .data();
      },

      // When clicking on thumbnail.
      _thumbnailInfo: function (event) {
        var $li = $(event.target).parents('.procedure-photo');
        var $block = $li.parents('.procedure-photos');
        var attributeName = $li.data('attribute-name');
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

      events: {
        'click .js-photo-thumbnail': 'showPhoto',
        'click .js-photo-image': 'hidePhoto'
      }
    });
  };

  return isBrowser
    ? define(definition)
    : module.exports = definition(require)
}(this, 'undefined' !== typeof window));

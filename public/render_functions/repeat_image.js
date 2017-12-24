import $ from 'jquery';
import { times } from 'lodash';




export const repeatImage = {
  name: 'repeatImage',
  displayName: 'Image Repeat',
  help: 'Repeat an image a given number of times',
  reuseDomNode: true,
  render(domNode, config, handlers) {
    const settings = {
      count: 10,
      image: '',
      ...config,
    };

    const container = $('<div class="repeatImage" style="pointer-events: none;">');

    function setSize(img) {
      if (img.naturalHeight > img.naturalWidth) img.height = settings.size;
      else img.width = settings.size;
    }

    function finish() {
      $(domNode).html(container);
      handlers.done();
    }

    const img = new Image();
    img.onload = function () {
      setSize(img);
      if (settings.max && settings.count > settings.max) settings.count = settings.max;
      times(settings.count, () => container.append(img.cloneNode(true)));

      if (settings.emptyImage) {
        if (settings.max == null) {
          throw new Error ('max must be set if using an emptyImage');
        }

        const emptyImage = new Image();
        emptyImage.onload = function () {
          setSize(emptyImage);
          times(settings.max - settings.count, () => container.append(emptyImage.cloneNode(true)));
          finish();
        };
        emptyImage.src = settings.emptyImage;
      } else {
        finish();
      }
    };

    img.src = settings.image;

  },
};

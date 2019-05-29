import $ from 'jquery';
import Distpicker from './distpicker';
import {
  NAMESPACE,
  WINDOW,
} from './constants';

if ($.fn) {
  const AnotherDistpicker = $.fn.distpicker;

  $.fn.distpicker = function jQueryDistpicker(option, ...args) {
    let result;

    this.each((i, element) => {
      const $element = $(element);
      const isDestroy = option === 'destroy';
      let distpicker = $element.data(NAMESPACE);

      if (!distpicker) {
        if (isDestroy) {
          return;
        }

        const options = $.extend({}, $element.data(), $.isPlainObject(option) && option);
        const apiUrl = options.api;
        if (apiUrl !== '' && apiUrl !== undefined) {
          $.ajax({
            url: apiUrl,
            dataType: 'json',
            success(res) {
              const data = JSON.parse(res);
              if (data.status === 0) {
                options.districts = data.data;
                distpicker = new Distpicker(element, options);
                $element.data(NAMESPACE, distpicker);
              } else {
                console.log(data.message);
              }
            },
            error(ex) {
              console.log(ex);
            },
          });
        } else {
          distpicker = new Distpicker(element, options);
          $element.data(NAMESPACE, distpicker);
        }
      }

      if (typeof option === 'string') {
        const fn = distpicker[option];

        if ($.isFunction(fn)) {
          result = fn.apply(distpicker, args);

          if (isDestroy) {
            $element.removeData(NAMESPACE);
          }
        }
      }
    });

    return typeof result === 'undefined' ? this : result;
  };

  $.fn.distpicker.Constructor = Distpicker;
  $.fn.distpicker.setDefaults = Distpicker.setDefaults;

  $.fn.distpicker.noConflict = function noConflict() {
    $.fn.distpicker = AnotherDistpicker;
    return this;
  };
}

if (WINDOW.document) {
  $(() => {
    $(`[data-toggle="${NAMESPACE}"]`).distpicker();
  });
}

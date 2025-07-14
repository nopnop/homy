/* From http://davidwalsh.name/function-debounce */

/* eslint-disable-next-line no-unused-vars */
function debounce (func, wait, immediate) {
  var timeout;
  return function () {
    var context = this; var args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

module.exports = function(global) {
  global.document = global.document || {};
  global.window = global.window || {};
  document.getSelection = getSelectionShim
  document.createRange = document.getSelection;
}

/**
 * DOM Traversal is not implemented in JSDOM
 * The best we can do is shim the functions
 */
function getSelectionShim() {
  return {
    getRangeAt: function() {},
    removeAllRanges: function() {},
    setStart: function() {},
    setEnd: function() {},
    addRange: function() {},
  };
};
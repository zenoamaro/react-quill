module.exports = function(global) {
  global.document = global.document || {};
  global.window = global.window || {};
  global.document.getSelection = global.window.getSelection || function() { 
      return { 
          getRangeAt: function() {},
          removeAllRanges: function() {},
      };
  };
}


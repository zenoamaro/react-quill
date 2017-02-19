module.exports = function(global) {
  global.document = global.document || {}
  global.document.getSelection = function() { 
      return { 
          getRangeAt: function() {}
      };
  };
}


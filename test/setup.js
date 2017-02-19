/**
 * Create mock DOM and browser globals
 * 
 * See Enzyme docs: 
 * https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md
 * https://github.com/airbnb/enzyme/blob/master/docs/api/mount.md
 */

var jsdom = require('jsdom').jsdom;

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'jsdom'
};

global.Node = Node;
global.Text = Text;
global.HTMLElement = HTMLElement;

/** 
 * Browser's global classes
 */
function Node () {}
function Text () {}
function HTMLElement () {}
/**
 * Create mock DOM and browser globals
 * 
 * See Enzyme docs: 
 * https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md
 * https://github.com/airbnb/enzyme/blob/master/docs/api/mount.md
 */

var jsdom = require('jsdom').jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

documentRef = document;

global.Node = Node;
global.Text = Text;
global.HTMLElement = HTMLElement;
global.HTMLDivElement = HTMLDivElement;

/** 
 * Browser's global classes
 */
function Node () {}
function Text () {}
function HTMLElement () {}
var HTMLDivElement = {}
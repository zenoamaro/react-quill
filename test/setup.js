/**
 * Create mock DOM and browser globals
 *
 * See Enzyme docs:
 * https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md
 * https://github.com/airbnb/enzyme/blob/master/docs/api/mount.md
 */

require('jsdom-global')();
require('./polyfills/MutationObserver.js')(global);
require('./polyfills/getSelection.js')(global);

// Configure the Enzyme adapter
const Enzyme = require('enzyme');
const EnzymeAdapter = require('enzyme-adapter-react-16');
Enzyme.configure({ adapter: new EnzymeAdapter() });

// Setup Chai to use Enzyme
const chai = require('chai');
const chaiEnzyme = require('chai-enzyme');
chai.use(chaiEnzyme());

global.expect = chai.expect;

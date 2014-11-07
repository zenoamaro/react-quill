'use strict';

// Fake DOM
global.document = require('jsdom').jsdom();

// Code coverage.
require('blanket')({ pattern: 'src' });

// Run tests.
require('./mixin');
require('./toolbar');
require('./component');

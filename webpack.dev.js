'use strict';
var webpack = require('webpack');

module.exports = {

	entry: './src/index.js',

	debug: true,
	devtool: 'module-source-map',

	output: {
		pathinfo: true,
		filename: './dist/react-quill.js',
		library: 'ReactQuill',
		libraryTarget: 'umd'
	},

	module: {
		// Shut off warnings about using pre-built javascript files
		// as Quill.js unfortunately ships one as its `main`.
		noParse: /node_modules\/quill\/dist/
	},

	externals: {
		'react': {
			'commonjs': 'react',
			'commonjs2': 'react',
			'amd': 'react',
			'root': 'React'
		},
		'react-dom': {
			'commonjs': 'react-dom',
			'commonjs2': 'react-dom',
			'amd': 'react-dom',
			'root': 'ReactDOM'
		},
		'react-dom/server': {
			'commonjs': 'react-dom/server',
			'commonjs2': 'react-dom/server',
			'amd': 'react-dom/server',
			'root': 'ReactDOMServer'
		},
		'prop-types': {
			'commonjs': 'prop-types',
			'commonjs2': 'prop-types',
			'amd': 'prop-types',
			'root': 'PropTypes'
		}
	}

};

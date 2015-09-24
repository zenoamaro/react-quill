'use strict';
var webpack = require('webpack');

module.exports = {

	entry: './src/index.js',

	debug: false,
	devtool: 'module-source-map',

	output: {
		filename: './dist/react-quill.min.js',
		library: 'ReactQuill',
		libraryTarget: 'umd'
	},

	module: {
		// Shut off warnings about using pre-built javascript files
		// as Quill.js unfortunately ships one as its `main`.
		noParse: /node_modules\/quill\/dist/
	},

	externals: {
		react: {
			'commonjs': 'react',
			'commonjs2': 'react',
			'amd': 'react',
			'root': 'React'
		},
		quill: {
			'commonjs': 'quill',
			'commonjs2': 'quill',
			'amd': 'quill',
			'root': 'Quill'
		}
	},

	plugins: [
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.OccurenceOrderPlugin()
	]

};
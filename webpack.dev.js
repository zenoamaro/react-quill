'use strict';
var webpack = require('webpack');

module.exports = {

	entry: './src/index.js',

	output: {
		filename: './dist/react-quill.js',
		pathinfo: true,
		library: 'ReactQuill',
		libraryTarget: 'umd'
	},

	externals: {
		react: {
			'commonjs': 'react',
			'commonjs2': 'react',
			'amd': 'react',
			'root': 'React'
		},
		quilljs: {
			'commonjs': 'quilljs',
			'commonjs2': 'quilljs',
			'amd': 'quilljs',
			'root': 'Quill'
		}
	},

	debug: true,
	devtool: 'inline-source-map'

};
const Path = require('path');
const dir = (...args) => Path.resolve(__dirname, ...args);

module.exports = {
  mode: 'production',
  entry: dir('src/index.js'),

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [
      {test:/\.jsx?$/, loader:'ts-loader', exclude:/node_modules/},
    ],
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
  },

  output: {
    path: dir('dist'),
    filename: 'react-quill.js',
    library: 'ReactQuill',
    libraryTarget: 'umd',
  },

  devServer: {
    contentBase: dir('dist'),
    stats: 'errors-only',
  },

};

const Path = require('path');
const dir = (...args) => Path.resolve(__dirname, ...args);

module.exports = {
  mode: 'production',
  entry: dir('src/index.tsx'),

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },

  module: {
    rules: [
      {
        test:/\.(ts|tsx|js|jsx)$/,
        loader:'ts-loader',
        // Quill uses ES6 syntax, so we need to transpile it
        exclude:/node_modules\/(?!quill)/
      },
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

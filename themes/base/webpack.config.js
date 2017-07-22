var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var PRODUCTION = process.env.NODE_ENV === 'production';
var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || 'localhost';
var CLIENT_SERVER = 'http://' + HOST + ':' + PORT;
var LINT_WATCH = process.argv.slice(2).length && process.argv.slice(2)[0] === 'lint';


var EXCLUDE_JS = [
  /node_modules/
];

/**
 *
 * @type {*[]}
 */
var plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new ExtractTextPlugin('css/[name].css'),
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery"

  })
];

/**
 * Plugins that will only be included in development
 * @type {Array}
 */
var devPlugins = [];

/**
 * Plugins that will only be included in production
 * @type {*[]}
 */
var productionPlugins = [
  new webpack.optimize.UglifyJsPlugin({minimize: true})
];

/**
 * Assets that will only be included in development
 * @type {string[]}
 */
var devServerEntry = [
  'webpack-dev-server/client?' + CLIENT_SERVER +'/',
  'webpack/hot/only-dev-server'
];

/**
 * Styles should only be extracted in production to allow hot-reload of css
 * @param loader
 * @returns {*}
 */
function styleLoader(loader) {
  if(PRODUCTION) return ExtractTextPlugin.extract('style-loader', loader);
  return 'style-loader!' + loader;
}

/**
 *
 * @returns {string}
 */
function autoPrefixLoader() {
  return 'autoprefixer-loader?' + JSON.stringify({
      browsers: ['Firefox > 20', 'iOS 7', 'IE 9']
    });
}

/**
 *
 * @type {*[]}
 */
var loaders = [
  {
    test: /\.js$/,
    loaders: ['react-hot', 'babel'],
    exclude: EXCLUDE_JS,
    include: __dirname
  },
  {
    test: /\.css$/,
    loader: styleLoader('css-loader!' + autoPrefixLoader())
  },
  {
    test: /\.scss/,
    loader: styleLoader('css-loader!' + autoPrefixLoader() + '!sass-loader')
  },
  {
    test: /\.less/,
    loader: styleLoader('css-loader!' + autoPrefixLoader() + '!less-loader')
  },
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: "url-loader?limit=10000&minetype=application/font-woff&name=fonts/[name].[ext]"
  },
  {
    test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: "file-loader?name=fonts/[name].[ext]"
  },
  {
    test: /\.jpg|\.png|\.gif$/,
    loader: "file-loader?name=images/[name].[hash].[ext]"
  },
  {
    test: /\.svg/,
    loader: "file-loader?name=svg/[name].[hash].[ext]!svgo-loader"
  }
];

/**
 *
 * @type {*[]}
 */
var preLoaders = [
  {test: /\.js$/, loader: "eslint-loader", exclude: EXCLUDE_JS}
];

module.exports = {

  entry: {
    main: PRODUCTION ? ['./source']: devServerEntry.concat(['./source'])
  },

  output: {
    filename: 'js/main.js',
    path: path.join(__dirname, 'production'),
    publicPath: PRODUCTION ? '/themes/base/production/' : 'http://localhost:3000/production/'
  },

  eslint: {configFile: '.eslintrc'},
  devtool: PRODUCTION ? null : 'cheap-module-eval-source-map',
  module: {loaders: loaders, preLoaders: LINT_WATCH || PRODUCTION ? preLoaders : []},
  resolve: {
    modulesDirectories: ['source/lib', 'node_modules']
  },
  plugins: PRODUCTION ? plugins.concat(productionPlugins) : plugins.concat(devPlugins)

};

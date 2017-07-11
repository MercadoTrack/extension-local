let webpackConf = require('./webpack.config')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

/* todo: remove sourcemaps for production */

webpackConf.plugins = [
    new UglifyJSPlugin({ output: { ascii_only: true } }),
    ...webpackConf.plugins
]

module.exports = webpackConf

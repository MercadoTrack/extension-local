let webpackConf = require('./webpack.config')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

webpackConf.plugins = [new UglifyJSPlugin() , ...webpackConf.plugins]

module.exports = webpackConf

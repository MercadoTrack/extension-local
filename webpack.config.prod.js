let webpackConf = require("./webpack.config");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const uglifyOptions = {
  ecma: 6,
  output: { ascii_only: true },
};

webpackConf.plugins = [
  new UglifyJSPlugin({
    uglifyOptions,
    sourceMap: false,
    parallel: { cache: true, workers: 4 },
  }),
  ...webpackConf.plugins,
];

module.exports = webpackConf;

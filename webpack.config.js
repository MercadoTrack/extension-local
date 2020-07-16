const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackNotifierPlugin = require("webpack-notifier");

const paths = {
  src: "./src",
  dist: `${__dirname}/dist`,
  logo: `${__dirname}/images/icon_128.png`,
};

module.exports = {
  cache: true,
  devtool: "source-map",
  entry: {
    content: `${paths.src}/scripts/content.js`,
    background: `${paths.src}/scripts/background.js`,
    popup: `${paths.src}/popup/popup.js`,
  },
  output: {
    path: `${paths.dist}/scripts`,
    filename: "[name].bundle.js",
  },
  plugins: [
    new WebpackNotifierPlugin({
      title: "MercadoTrack",
      contentImage: paths.logo,
    }),
    new CopyWebpackPlugin([
      { from: `${paths.src}/popup/popup.html`, to: paths.dist },
      { from: "./images", to: `${paths.dist}/images` },
      { from: "./manifest.json", to: paths.dist },
      { from: "./LICENSE", to: paths.dist },
      { from: `${paths.src}/scripts/env.js`, to: `${paths.dist}/scripts` },
      {
        from: "./vendor",
        to: `${paths.dist}/scripts/vendor`,
      },
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
    ],
  },
};

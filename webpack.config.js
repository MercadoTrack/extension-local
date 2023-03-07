const CopyWebpackPlugin = require("copy-webpack-plugin");

const paths = {
  src: "./src",
  dist: `${__dirname}/dist`,
  logo: `${__dirname}/images/icon_128.png`,
};

module.exports = {
  mode: "development",
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
    new CopyWebpackPlugin({
      patterns: [
        { from: `${paths.src}/popup/popup.html`, to: paths.dist },
        { from: "./images", to: `${paths.dist}/images` },
        { from: "./manifest.json", to: paths.dist },
        { from: "./LICENSE", to: paths.dist },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
};

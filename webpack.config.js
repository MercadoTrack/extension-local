const CopyWebpackPlugin = require('copy-webpack-plugin')

const paths = {
    src: './src',
    dist: `${__dirname}/dist`
}

module.exports = {
    entry: {
        content: `${paths.src}/scripts/content.js`,
        background: `${paths.src}/scripts/background.js`,
        popup: `${paths.src}/popup/popup.js`
    },
    output: {
        path: `${paths.dist}/scripts`,
        filename: '[name].bundle.js'
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: `${paths.src}/popup/popup.html`, to: `${paths.dist}/popup` },
            { from: `${paths.src}/popup/popup.css`, to: `${paths.dist}/popup` },
            { from: './images', to: `${paths.dist}/images` },
            { from: './manifest.json', to: paths.dist },
            { from: './LICENSE', to: paths.dist },
        ])
    ]
}

module.exports = {
    entry: {
        content: './src/scripts/content.js', 
        background: './src/scripts/background.js', 
        popup: './src/popup/popup.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: "[name].bundle.js"
    }
}

let copy = require('copy')

copy('./src/popup/popup.html', './dist/', { flatten: true }, () => console.log('Copied popup.html'))
copy('./src/popup/popup.css', './dist/', { flatten: true }, () => console.log('Copied popup.css'))

import Storage from './modules/storage'
import Item from './modules/item.model'

(() => {

    Storage.get()
        .then(items => items.forEach(update))
        .catch(console.log)

    function update(item) {
        return Item.fetch(item.id)
            .then(data => item.addHistory(data))
            .then(() => saveItem(item))
    }

    function saveItem(item) {
        return Storage.saveItem(item)
            .then(success => console.info(success.message))
    }

})()

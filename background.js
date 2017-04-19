Storage.get()
    .then(items => items.forEach(update))
    .catch(console.log)

function update(item) {
    Item.fetch(item.id)
        .then(data => item.addHistory(data))
        .then(() => Storage.saveItem(item)
            .then(success => console.info(success.message)))
}

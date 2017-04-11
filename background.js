Storage.get().then(update)

function update(items) {
    items.forEach(updateItem);
}

function updateItem(item) {
    return item.fetch()
        .then(() => Storage.saveItem(item).then(success => console.log(success.message)))
        .catch(console.warn);
}

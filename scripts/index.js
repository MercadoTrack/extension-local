const itemId = window.location.pathname.split('-')[1];
const $chart_siblin = document.getElementById('shortDescription');

let item;

Storage.getSize()
    .then(bytes => console.log(`Size is ${bytes} bytes and ${bytesToSize(bytes)}`))

Storage.get(itemId)
    .then(handleStorage)
    .catch(handleStorage);

function handleStorage(result) {
    const savedItem = result[itemId] || {};
    item = new Item(itemId, savedItem.history);
    item.fetch()
        .then(saveAndGraph)
        .catch(console.warn)
}

function saveAndGraph() {
    if (!item) throw `No item fetched with id ${itemId}`;
    Storage.saveItem(item)
        .then(() => Graph.show(item, $chart_siblin))
        .catch(console.warn)
}

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};
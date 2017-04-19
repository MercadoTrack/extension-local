const itemId = window.location.pathname.split('-')[1];
const $chart_siblin = document.getElementById('shortDescription');

Storage.get(itemId)
    .then(handleSuccess)
    .catch(handleFail);

function handleSuccess(result) {
    item = new Item(result[itemId]);
    return Item.fetch(itemId)
        .then(data => item.addHistory(data))
        .then(() => saveAndGraph(item))
}

function handleFail() {
    return Item.fetch(itemId)
        .then(data => new Item(data))
        .then(saveAndGraph)
}

function saveAndGraph(item) {
    if (!item) throw `No item fetched with id ${itemId}`;
    return Storage.saveItem(item)
        .then(() => Graph.show(item, $chart_siblin))
}

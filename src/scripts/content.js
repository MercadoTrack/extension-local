import Item from './modules/item.model'
import Storage from './modules/storage'
import Graph from './modules/graph'
import DomUtils from './modules/utils/dom.utils'

const itemId = window.location.pathname.split('-')[1];
const $chartSiblin = document.getElementById('shortDescription');

Storage.get(itemId)
    .then(handleSuccess)
    .catch(handleFail);

function handleSuccess(result) {
    let item = new Item(result[itemId]);
    Item.fetch(itemId).then(data => {
        item.addHistory(data)
        saveAndGraph(item)
    })
}

function handleFail() {
    let trackBtn = DomUtils.createTrackBtn()
    trackBtn.addEventListener('click', trackBtnAction)
    $chartSiblin.parentNode.insertBefore(trackBtn, $chartSiblin)
}

function trackBtnAction() {
    Item.fetch(itemId).then(data => {
        this.parentNode.removeChild(this)
        let item = new Item(data)
        saveAndGraph(item)
    })
}

function saveAndGraph(item) {
    if (!item) throw `No item fetched with id ${itemId}`;
    return Storage.saveItem(item)
        .then(() => Graph.show(item, $chartSiblin))
}

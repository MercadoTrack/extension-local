import Item from './modules/item.model'
import Storage from './modules/storage'
import Graph from './modules/graph'
import DomUtils from './modules/utils/dom.utils'

const itemId = window.location.pathname.split('-')[1];
const marketId = window.location.pathname.split('-')[0];
const $chartSiblin = DomUtils.getChartSiblin();

Storage.get(itemId)
    .then(handleSuccess)
    .catch(handleFail);

/* item was being tracked */
function handleSuccess(result) {
    let item = new Item(result[itemId]);
    Item.fetch(marketId, itemId).then(data => {
        item.addHistory(data)
        saveAndGraph(item)
    })
}

/* item wasn't being tracked */
function handleFail() {
    let { container, trackBtn } = DomUtils.createTrackBtn()
    trackBtn.addEventListener('click', trackBtnAction)
    $chartSiblin.parentNode.insertBefore(container, $chartSiblin)
}

function trackBtnAction() {
    Item.fetch(marketId, itemId).then(data => {
        const container = this.parentNode
        /* calm down with those clicks */
        if(!container.parentNode) return
        container.parentNode.removeChild(container)
        let item = new Item(data)
        saveAndGraph(item)
    })
}

function saveAndGraph(item) {
    if (!item) throw `No item fetched with id ${itemId}`;
    return Storage.saveItem(item)
        .then(() => Graph.show(item, $chartSiblin))
}

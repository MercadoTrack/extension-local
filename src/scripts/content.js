import Item from './modules/item.model'
import Storage from './modules/storage'
import Graph from './modules/graph'
import DomUtils from './modules/utils/dom.utils'

const [marketId, itemId] = getIdsFromUrl(window.location.pathname)
const $chartSiblin = DomUtils.getChartSiblin();

setTimeout(() => {
    Storage.get(itemId)
        .then(handleSuccess)
        .catch(handleFail);
}, 1500)

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
    const mtLink = DomUtils.createGoToMTLink(marketId, itemId)
    container.appendChild(mtLink)
}

function trackBtnAction() {
    window.chrome.runtime.sendMessage({ cmd: 'fetch', data: { marketId, itemId } }, (response) => {
        if (response && response.data) {
            const container = this.parentNode
            /* calm down with those clicks */
            if (!container.parentNode) return
            container.parentNode.removeChild(container)
            let item = new Item(response.data)
            saveAndGraph(item)
        }
    })
}

function saveAndGraph(item) {
    if (!item) throw `No item fetched with id ${itemId}`;
    return Storage.saveItem(item)
        .then(() => Graph.show({ item, elem: $chartSiblin, itemId, marketId }))
}

function getIdsFromUrl(url) {
    return url
        .split('-')
        .map(id => id.replace(/\W/g, ''))
}

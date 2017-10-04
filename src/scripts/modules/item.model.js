import Utils from './utils/utils'

export default class Item {

    constructor({ id, history, price, thumbnail, title, permalink }) {
        this.id = id.replace(/\D/g, '');
        this.market = id.replace(/[0-9]/g, '');
        this.permalink = permalink;
        this.thumbnail = thumbnail;
        this.title = title;
        this.history = parseHistory({ history, price });
        this.price = this.history[this.history.length - 1].price
    }

    static fetch(marketId, id) {
        return fetch(createEndpoint(marketId, id))
            .then(pipeResponse)
            .then(res => res.json())
    }

    addHistory({ price }) {
        this.history = parseHistory({ history: this.history, price });
        this.price = this.history[this.history.length - 1].price
    }

    /* returns 
    0 for same price 
    +1 for price increased 
    -1 for price lowered */
    getIndexedHistoryFluctuation(index) {
        if (index <= 0) return 0
        const indexedPrice = this.history[index].price
        const priceBefore = this.history[index - 1].price
        return indexedPrice !== priceBefore
            ? indexedPrice > priceBefore ? 1 : -1
            : 0
    }

    get endpoint() {
        return createEndpoint(this.market, this.id);
    }

}

function parseHistory({ history, price }) {
    const date = Utils.formatDate()
    if (!history) return [{ price, date }];
    const latest = history[history.length - 1];
    if (!latest || latest.price != price || latest.date != date) {
        return [...history, { price, date }];
    }
    return history;
}

function pipeResponse(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

function createEndpoint(marketId = '/MLA', id) {
    return `https://api.mercadolibre.com/items${marketId}${id}`;
}

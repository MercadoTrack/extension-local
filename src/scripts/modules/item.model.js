import Utils from './utils/utils'

export default class Item {

    constructor({ id, history, price, thumbnail, title, permalink }) {
        this.id = id.replace(/\D/g, '');
        this.permalink = permalink;
        this.thumbnail = thumbnail;
        this.title = title;
        this.history = parseHistory({ history, price });
        this.price = this.history[this.history.length - 1].price
    }

    static fetch(id) {
        return fetch(createEndpoint(id))
            .then(pipeResponse)
            .then(res => res.json())
    }

    addHistory({ price }) {
        this.history = parseHistory({ history: this.history, price });
        this.price = this.history[this.history.length - 1].price
    }

    get endpoint() {
        return createEndpoint(this.id);
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
};

function createEndpoint(id) {
    return `https://api.mercadolibre.com/items/MLA${id}`;
}

import Utils from './utils/utils'

export default class Item {

    constructor({ id, history, price, thumbnail, title, permalink }) {
        this.id = id.replace(/\D/g, '');
        this.permalink = permalink;
        this.thumbnail = thumbnail;
        this.title = title;
        this.history = parseHistory({ history, price });
        this.price = this.history[this.history.length - 1].price
        this.priceClass = getPriceClass({ history, price });
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

function getLatestHistory(history) {
    if (!history) return null;
    return history[history.length - 1];
}

function parseHistory({ history, price }) {
    const date = Utils.formatDate()
    const latest = getLatestHistory(history);

    if (!latest) return [{ price, date }];

    if (latest.price != price || latest.date != date) {
        return [...history, { price, date }];
    }

    return history;
}

function getPriceClass() {
    const latest = getLatestHistory(history);

    const samePrice = !latest || latest.price == price;
    const betterPrice = !samePrice && checkBetterPrice(history, price);

    return { 'price': samePrice, 'better-price': betterPrice, 'worse-price': !samePrice && !betterPrice  };
}

function checkBetterPrice({ history, price} ) {    
      const latest = getLatestHistory(history);
      if (!latest) return false;

      return price > latest.price;
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

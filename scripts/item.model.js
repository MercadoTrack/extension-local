const success = { success: true };
const fail = error => ({ success: false, error });

// let historyMock = [{
//     "date": "05/04/17",
//     "price": 10959
// }, {
//     "date": "05/04/17",
//     "price": 9800
// }, {
//     "date": "13/03/17",
//     "price": 10959
// }, {
//     "date": "15/02/17",
//     "price": 8300
// }, {
//     "date": "01/02/17",
//     "price": 13450
// }].reverse();

class Item {
    constructor(id, history) {
        this.id = id;
        this.history = history || [];
    }

    fetch() {
        return fetch(this.endpoint)
            .then(pipeResponse)
            .then(res => {
                return res.json()
                    .then(data => {
                        this.loadHistory(data);
                        this.status = success;
                        return success;
                    }).catch(fail);
            }).catch(err => {
                const error = fail(err);
                this.status = error;
                return error;
            });
    }

    loadHistory({ price }) {
        const date = moment().format('DD/MM/YY');
        // if (this.history.length === 0) {
        //     console.info('Added mock')
        //     this.history = historyMock;
        // }
        const latest = this.history[this.history.length - 1];
        if (!latest || latest.price != price || latest.date != date) {
            this.history.push({ price, date });
        }
    }

    get endpoint() {
        return `https://api.mercadolibre.com/items/MLA${this.id}`;
    }

    get price() {
        return +this.history[0];
    }

}

function pipeResponse(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
};

function despiseTime(date) {
    return date.substring(0, 10);
}

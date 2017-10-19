// , date param to item model

function update(item) {
    return Item.fetch(item.market, item.id)
        .then(data => {
            let date
            item.addHistory(data)
            date = Utils.formatDate(new Date('10/18/2017'))
            item.addHistory({ price: data.price - 250 }, date)
            date = Utils.formatDate(new Date('10/17/2017'))
            item.addHistory({ price: data.price + 500 }, date)
            date = Utils.formatDate(new Date('10/16/2017'))
            item.addHistory({ price: data.price + 1000 }, date)
            date = Utils.formatDate(new Date('10/15/2017'))
            item.addHistory({ price: data.price + 1000 }, date)
            item.history = item.history.sort((a, b) => {
                let [dd, mm, yy] = a.date.split('/')
                let aDate = new Date([mm, dd, yy].join('/'))
                let [dd1, mm1, yy1] = b.date.split('/')
                let bDate = new Date([mm1, dd1, yy1].join('/'))
                let res = aDate - bDate
                return res
            })
        })
        .then(() => saveItem(item))
}
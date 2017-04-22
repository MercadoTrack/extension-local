(() => {

    let $container = document.getElementById('container');
    let $clearBtn = document.getElementById('clear');
    $clearBtn.addEventListener('click', clear);

    refresh();

    function refresh() {
        $container.innerHTML = '';
        Promise.all([
            Storage.getSize().then(handleSize),
            Storage.get().tUtilshen(handleItems)
        ]);
    }

    function handleSize(size) {
        $clearBtn.innerHTML = `Clear ${size}`;
    }

    function handleItems(items) {
        items.forEach(item => $container.appendChild(createItemElem(item)))
    }

    function createItemElem(item) {
        let $elem = document.createElement('div')
        $elem.setAttribute('id', item.id)
        $elem.classList.add('item')
        $elem.innerHTML = `
            <span class="title">${item.id} - ${wrapTitle(item.title)}</span>
            <button class="btn btn-show" id="show-btn-${item.id}" type="button">+</button>
            <div class="extra-info hidden" id="extra-info-${item.id}">
                <a class="navigate" href="${item.permalink}" target="_blank">&#128279;</a>
                ${getHistoryElems(item)}
            </div>`
        let $btn = $elem.querySelector(`#show-btn-${item.id}`);
        let $extraInfo = $elem.querySelector(`#extra-info-${item.id}`);
        $btn.addEventListener('click', () => {
            $btn.innerHTML = $btn.innerHTML == '+' ? '-' : '+';
            $extraInfo.classList.toggle('hidden')
        })
        return $elem
    }

    function getHistoryElems(item) {
        let elems = '';
        item.history.forEach(hist => elems += `
            <div class="history">
                <span class="date">${hist.date}:</span> <span class="money">${formatMoney(hist.price)}</span>
            </div>`
        )
        return elems
    }

    function wrapTitle(title) {
        return title.substring(0, 25) + '...';
    }

    function clear() {
        return Storage.clear().then(refresh)
    }

    /* send to utils */
    function formatMoney(value) {
        const options = { style: 'currency', currency: 'ARS' };
        const numberFormat = new Intl.NumberFormat('es-AR', options);
        return numberFormat.format(value);
    }

})()

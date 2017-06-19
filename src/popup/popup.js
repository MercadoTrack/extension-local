/* todo: this file must be modularized */
import Storage from '../scripts/modules/storage'
import Utils from '../scripts/modules/utils/utils'
import '../../node_modules/materialize-css/dist/js/materialize.min'
import './popup.sass'

(() => {

    let $container = document.getElementById('container');
    let $clearBtn = document.getElementById('clear');
    $clearBtn.addEventListener('click', clear);

    refresh();

    function refresh() {
        $container.innerHTML = '';
        Promise.all([
            Storage.getSize().then(handleSize),
            Storage.get().then(handleItems)
        ]);
    }

    function handleSize(size) {
        $clearBtn.innerHTML = `Limpiar ${size}`;
    }

    function handleItems(items) {
        items.forEach(item => $container.appendChild(createItemElem(item)))
    }

    function createItemElem(item) {
        let $elem = document.createElement('div')
        $elem.setAttribute('id', item.id)
        $elem.classList.add('item')
        $elem.innerHTML = `
            <button class="btn btn-delete" id="delete-btn-${item.id}">&#x274C;</button>
            <span class="title" title="${item.price} - ${item.title}">
                <span class="price">${Utils.formatMoney(item.price)}</span> - ${wrapTitle(item.title)}
            </span>
            <button class="btn btn-show" id="show-btn-${item.id}" type="button">+</button>
            <div class="extra-info hidden" id="extra-info-${item.id}">
                <a class="navigate" href="${item.permalink}" target="_blank">&#128279;</a>
                ${getHistoryElems(item)}
            </div>`
        let $showBtn = $elem.querySelector(`#show-btn-${item.id}`);
        let $deleteBtn = $elem.querySelector(`#delete-btn-${item.id}`);
        let $extraInfo = $elem.querySelector(`#extra-info-${item.id}`);
        $showBtn.addEventListener('click', () => {
            $showBtn.innerHTML = $showBtn.innerHTML == '+' ? '-' : '+';
            $extraInfo.classList.toggle('hidden')
        })
        $deleteBtn.addEventListener('click', () => {
            Storage.deleteItem(item).then(refresh)
        });
        return $elem
    }

    function getHistoryElems(item) {
        let elems = '';
        item.history.forEach(hist => elems += `
            <div class="history">
                <span class="date">${hist.date}:</span> <span class="money">${Utils.formatMoney(hist.price)}</span>
            </div>`
        )
        return elems
    }

    function wrapTitle(title) {
        return title.substring(0, 20) + '...';
    }

    function clear() {
        return Storage.clear().then(refresh)
    }

})()

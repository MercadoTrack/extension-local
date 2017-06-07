/* todo: this file must be modularized */

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
        $clearBtn.innerHTML = `BORRAR TODOS`;//`Limpiar ${size}`;
    }

    function handleItems(items) {
        items.forEach(item => $container.appendChild(createItemElem(item)))
    }

    function createItemElem(item) {
        let $elem = document.createElement('div')
        $elem.setAttribute('id', item.id)
        $elem.classList.add('item')
        $elem.innerHTML = `
            <button class="btn amber accent-3 btn-delete" id="delete-btn-${item.id}">
                <img class="btn-delete-img" src="../images/Material Icons/trash-bin-black-2.png"></img>
            </button>
            <a href="${item.permalink}" target="_blank">
                <span  class="title" title="${item.price} - ${item.title}">            
                <span class="price">${Utils.formatMoney(item.price)}</span> - ${wrapTitle(item.title)}
                </span>
            </a>
            <button class="btn btn-show indigo" id="show-btn-${item.id}" value="+" type="button">            
                <img id="show-btn-img-${item.id}" src="../images/Material Icons/expand_more_white_36x36.png"></img>
            </button>
            <div class="extra-info hidden" id="extra-info-${item.id}">
                
                ${getHistoryElems(item)}
            </div>`
        let $showBtn = $elem.querySelector(`#show-btn-${item.id}`);
        let $deleteBtn = $elem.querySelector(`#delete-btn-${item.id}`);
        let $extraInfo = $elem.querySelector(`#extra-info-${item.id}`);
        let $expandBtn = $elem.querySelector(`#show-btn-img-${item.id}`);

        $showBtn.addEventListener('click', () => {
            if ($showBtn.value == '+') {
                $showBtn.value = '-';
                $expandBtn.src = "../images/Material Icons/expand_less_white_36x36.png";
            } else {
                $showBtn.value = '+';
                $expandBtn.src = "../images/Material Icons/expand_more_white_36x36.png";
            }            
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
            <!-- <div class="history collection">
                <span class="date">${hist.date}     ${Utils.formatMoney(hist.price)}</span>
            </div> -->
            <ul class="history collection">
                <li class="history-item">
                    <span class="date">${hist.date}: </span>
                    <span>${Utils.formatMoney(hist.price)}</span>
                </li>
            </ul>
            `
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

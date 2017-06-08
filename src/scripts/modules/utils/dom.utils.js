export default {

    createCanvas() {
        let canvas = document.createElement('canvas');
        Object.assign(canvas.style, {
            display: 'none',
            opacity: '0',
            webkitTransition: 'opacity 1s ease'
        });
        return canvas;
    },

    createContainer(canvas, itemsCount) {
        let div = document.createElement('div');
        let button = createToggleButton(canvas, itemsCount);
        div.appendChild(button);
        div.appendChild(canvas);
        Object.assign(div.style, {
            margin: 'auto',
            maxWidth: '700px',
            textAlign: 'center',
            webkitTransition: 'height 1s ease'
        });
        return div;
    },

    addTrackBtn($elem, asyncCallback) {
        let button = document.createElement('button')
        button.classList.add('ui-button', 'ui-button--primary')
        button.innerHTML = 'Seguir este articulo'
        Object.assign(button.style, {
            margin: '15px auto',
            maxWidth: '50%'
        })
        button.addEventListener('click', () => {
            asyncCallback()
                .then(() => button.parentNode.removeChild(button))
        })
        $elem.parentNode.insertBefore(button, $elem)
    }

}

function toggleCanvas(canvas) {
    let display;
    if (canvas.style.display === 'none') {
        display = 'block';
        setTimeout(() => canvas.style.opacity = '1', 100);
    } else {
        display = 'none';
        canvas.style.opacity = '0';
    }
    canvas.style.display = display;
    return display;
}

function createToggleButton(canvas, itemsCount) {
    const showText = `Ver grafico <sup>(${itemsCount})</sup>`;
    const hideText = 'Esconder grafico';
    let button = document.createElement('button');
    button.classList.add('ui-button', 'ui-button--primary');
    Object.assign(button.style, {
        margin: '15px auto',
        maxWidth: '50%'
    });
    button.innerHTML = showText;
    button.addEventListener('click', () => {
        const display = toggleCanvas(canvas);
        button.innerHTML = display === 'none' ? showText : hideText;
    });
    return button;
}


import containerHtml from './templates/container.html'
import trackBtnHtml from './templates/track.btn.html'

export default {

    initDOM(itemsCount) {
        let container = htmlToElement(containerHtml)
        const canvas = container.querySelector('#mt-canvas')
        const toggleBtn = container.querySelector('#mt-toggle')
        addToggleBtnBehavior(toggleBtn, canvas, itemsCount)
        return { canvas, container }
    },

    createTrackBtn() {
        return htmlToElement(trackBtnHtml)
    }

}

function htmlToElement(html) {
    let template = document.createElement('template')
    template.innerHTML = html
    return template.content.firstChild
}

function toggleCanvas(canvas) {
    const display = canvas.style.display === 'none' ? 'block' : 'none'
    canvas.style.display = display
    return display
}

function addToggleBtnBehavior(toggleBtn, canvas, itemsCount) {
    const showText = `Ver grafico <sup>(${itemsCount})</sup>`
    const hideText = 'Esconder grafico'
    toggleBtn.innerHTML = showText
    toggleBtn.addEventListener('click', () => {
        const display = toggleCanvas(canvas)
        toggleBtn.innerHTML = display === 'none' ? showText : hideText
    })
}


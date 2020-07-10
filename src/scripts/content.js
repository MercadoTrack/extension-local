import Chart from 'chart.js'
import Utils from './modules/utils/utils'

const defaults = {
  defaultFontSize: 15,
  legend: { display: false }
};

/* chart defaults */
Object.assign(Chart.defaults.global, defaults);

const [marketId, itemId] = getIdsFromUrl(window.location.pathname);
const mercadotrackId = [marketId, itemId].join('')

fetch(`https://api.mercadotrack.com/articles/${mercadotrackId}`)
  .then((res) => {
    if (!res.ok) throw Error(res.statusText);
    return res.json();
  })
  .then((item) => {
    const mainContainer = getMainContainer();
    const container = htmlToElement(`<div id="mercadotrack-container" style="width: 100%; display: flex; justify-content: center; align-items: center; flex-direction: column; padding: 0 15px;">
        <div style="display: flex; justify-content: center; align-items: center;">
            <button id="mt-toggle" class="ui-button ui-button--primary" style="margin: 15px auto;"></button>
        </div>
        <canvas id="mt-canvas" style="display: none;"></canvas>
    </div>`)
    const canvas = container.querySelector('#mt-canvas')
    const toggleBtn = container.querySelector('#mt-toggle')
    addToggleBtnBehavior(toggleBtn, canvas, item.history.length)
    const mtLink = createGoToMTLink(marketId, itemId);
    toggleBtn.parentNode.appendChild(mtLink);
    mainContainer.prepend(container);
    new Chart(canvas, Utils.getItemChartOptions(item));
  })
  .catch(() => {
    const $trackBtn = createTrackBtn(mercadotrackId);
    const mainContainer = getMainContainer();
    mainContainer.prepend($trackBtn);
  });


// utils

function getIdsFromUrl(url) {
  return url.split('-').map((id) => id.replace(/\W/g, ''));
}

function htmlToElement(html) {
  let template = document.createElement('template')
  template.innerHTML = html
  return template.content.firstChild
}

function getMainContainer() {
  const shortDescription = document.getElementById('shortDescription');
  const productGalleryCollection = document.getElementById('productGalleryCollection');
  if(!shortDescription && !productGalleryCollection) {
    const FATAL_ERROR = '[MercadoTrack] La extensión no puede funcionar debido a un cambio de diseño por parte del equipo de MercadoLibre.\nPor favor contactate con los desarrolladores a través de un issue en GitHub: https://github.com/GMaiolo/mercado-track/issues'
    throw new Error(FATAL_ERROR)
  }
  return (shortDescription || productGalleryCollection).parentNode
}

function createTrackBtn() {
  const href = `https://mercadotrack.com/articulo/${mercadotrackId}`
  return htmlToElement(
    `<div id="mercadotrack-container" style="width: 100%; display: flex; justify-content: center; align-items: center; padding: 0 15px;">
      <a
        id="mercadotrack-btn"
        class="ui-button ui-button--primary"
        style="margin: 15px;"
        target="_blank"
        rel="noopener noreferrer"
        href="${href}"
      >
        Seguir este articulo con Mercadotrack
      </a>
    </div>`
    )
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

function createGoToMTLink(marketId, itemId) {
  const link = document.createElement('a')
  const linkText = document.createTextNode('Ver en MercadoTrack')
  link.setAttribute('href', `https://mercadotrack.com/articulo/${marketId}${itemId}`)
  link.setAttribute('style', 'margin: auto 15px;')
  link.setAttribute('target', '_blank')
  link.appendChild(linkText)
  return link
}

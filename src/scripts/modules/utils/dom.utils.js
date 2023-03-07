const containerHtml = `
<div id="mt-container"
    style="width: 100%; display: flex; justify-content: center; align-items: center; flex-direction: column; padding: 0 15px;">
    <div style="display: flex; justify-content: center; align-items: center;">
        <button id="mt-toggle" class="andes-button andes-button--loud" style="margin: 15px auto; background-color: #129496;"></button>
    </div>
    <canvas id="mt-canvas" style="display: none;"></canvas>
</div>
`;

const trackBtnHtml = `
<div id="mt-container"
    style="width: 100%; display: flex; justify-content: center; align-items: center; padding: 0 15px;">
    <button id="mt-track" class="andes-button andes-button--loud" style="margin: 15px; background-color: #129496;">
        <span class="andes-button__content">Seguir este articulo</span>
    </button>
</div>
`;

/* TODO: move to constants module along with all strings in the app */
const githubIssuesUrl = "https://github.com/GMaiolo/mercado-track/issues";
const FATAL_ERROR = `[MercadoTrack] La extensión no puede funcionar debido a un cambio de diseño por parte del equipo de MercadoLibre.
Por favor contactate con los desarrolladores a través de un issue en GitHub: ${githubIssuesUrl}`;

export default {
  getChartSiblin() {
    const shortDescription = document.getElementById("shortDescription");
    const productGalleryCollection = document.getElementById(
      "productGalleryCollection"
    );
    const productContainer = document.querySelector(
      ".ui-pdp-container__row.ui-pdp-container__row--gallery"
    );
    if (!shortDescription && !productGalleryCollection && !productContainer)
      throw new Error(FATAL_ERROR);
    return shortDescription || productGalleryCollection || productContainer;
  },

  initDOM(itemsCount) {
    let container = htmlToElement(containerHtml);
    const canvas = container.querySelector("#mt-canvas");
    const toggleBtn = container.querySelector("#mt-toggle");
    addToggleBtnBehavior(toggleBtn, canvas, itemsCount);
    return { canvas, toggleBtn, container };
  },

  createTrackBtn() {
    const container = htmlToElement(trackBtnHtml);
    const trackBtn = container.querySelector("#mt-track");
    return { container, trackBtn };
  },

  createGoToMTLink(marketId, itemId) {
    const link = document.createElement("a");
    const linkText = document.createTextNode("Ver en MercadoTrack");
    link.setAttribute(
      "href",
      `https://mercadotrack.com/articulo/${marketId}${itemId}`
    );
    link.setAttribute("style", "margin: auto 15px;");
    link.setAttribute("target", "_blank");
    link.appendChild(linkText);
    return link;
  },
};

function htmlToElement(html) {
  let template = document.createElement("template");
  template.innerHTML = html;
  return template.content.firstChild;
}

function toggleCanvas(canvas) {
  const display = canvas.style.display === "none" ? "block" : "none";
  canvas.style.display = display;
  return display;
}

function addToggleBtnBehavior(toggleBtn, canvas, itemsCount) {
  const showHtml = `<span class="andes-button__content">
        Ver grafico (${itemsCount})
    </span>`;
  const hideHtml = `<span class="andes-button__content">
        Esconder grafico
    </span>`;
  toggleBtn.innerHTML = showHtml;
  toggleBtn.addEventListener("click", () => {
    const display = toggleCanvas(canvas);
    toggleBtn.innerHTML = display === "none" ? showHtml : hideHtml;
  });
}

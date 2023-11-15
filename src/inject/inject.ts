function getIdFromUrl(url: string) {
  const [rawId] = url.match(/(M[A-Z]{2}-\d+)/g) || [];
  const id = rawId && rawId.replace("-", "");

  if (id) {
    return id;
  }

  const [match] = url.match(/\/p\/(M[A-Z]{2}\d+)/g) || [];
  const pid = match?.replace("/p/", "");

  return pid;
}

function getMainContainer() {
  const rootApp = document.getElementById("root-app");

  if (!rootApp) {
    console.error(
      "[MercadoTrack] La extensión no puede funcionar debido a un cambio de diseño por parte del equipo de MercadoLibre.\nPor favor contactate con los desarrolladores a través de un issue en GitHub: https://github.com/GMaiolo/mercado-track/issues",
    );
  }

  return rootApp;
}

function htmlToElement(html: string) {
  const template = document.createElement("template");
  html = html.trim(); // Never trust an incoming string!
  template.innerHTML = html;
  return template.content.firstChild;
}

const run = async () => {
  console.log("MT Running");

  const elementId = "mercadotrack-container";

  const mercadotrackId = getIdFromUrl(window.location.pathname);

  const res = await fetch(
    `https://mercadotrack.com/api/articulos/track/${mercadotrackId}`,
  ).catch(() => {});

  if (!res || res.status !== 200) {
    return;
  }

  setTimeout(() => {
    if (document.getElementById(elementId)) {
      return;
    }

    const href = `https://mercadotrack.com/articulo/${mercadotrackId}`;

    const $trackBtn = htmlToElement(
      `
      <div id="${elementId}" style="width: 1184px; display: flex; align-items: center; margin: 1rem auto;">
        <a
          id="mercadotrack-btn"
          style="display: flex; align-items: center; background-color: rgb(48,124,124); border-radius: 2.5rem; font-size: 1.25rem; padding: 0.75rem 1.5rem; color: white; font-family: Helvetica;"
          target="_blank"
          rel="noopener noreferrer"
          href="${href}"
        >
          <span>Ver en MercadoTrack</span>
          <img
            style="padding: 1px; margin: auto; margin-left: 0.5rem; height: 2rem; width: 2rem; border-radius: 9999px; background-color: white;"
            src="https://mercadotrack.com/icon_128.png"
            alt="MercadoTrack Logo"
          />
        </a>
      </div>
      `,
    );

    const mainContainer = getMainContainer();

    if (!mainContainer || !$trackBtn) {
      return;
    }

    mainContainer.prepend($trackBtn);
  }, 2000);
};

run();

// Also run when the url changes
window.addEventListener("popstate", run);

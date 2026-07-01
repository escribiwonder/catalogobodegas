const storageKey = "mi-bodega-design-v1";

const typeClass = {
  Tinto: "red",
  Blanco: "white",
  Rosado: "rose"
};

const wines = loadWines();

const elements = {
  list: document.querySelector("#wineList"),
  sort: document.querySelector("#sortSelect"),
  total: document.querySelector("#totalBottles"),
  red: document.querySelector("#redCount"),
  white: document.querySelector("#whiteCount"),
  rose: document.querySelector("#roseCount"),
  dialog: document.querySelector("#wineDialog"),
  form: document.querySelector("#wineForm"),
  add: document.querySelector("#addButton"),
  cancel: document.querySelector("#cancelButton")
};

elements.sort.addEventListener("change", render);
elements.add.addEventListener("click", () => elements.dialog.showModal());
elements.cancel.addEventListener("click", () => elements.dialog.close());

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(elements.form).entries());
  wines.push({
    id: crypto.randomUUID(),
    name: data.name.trim(),
    type: data.type,
    price: data.price.trim(),
    year: data.year.trim(),
    description: data.description.trim() || "Nueva referencia de la bodega.",
    photos: 1
  });
  saveWines();
  elements.form.reset();
  elements.dialog.close();
  render();
});

function loadWines() {
  const saved = localStorage.getItem(storageKey);
  if (saved) return JSON.parse(saved);

  return [
    {
      id: "wine-1",
      name: "Botella 1",
      type: "Tinto",
      price: "25,00",
      year: "2018",
      description: "Reserva 2018. Crianza en barrica. Notas de frutas rojas y especias.",
      photos: 1
    },
    {
      id: "wine-2",
      name: "Botella 2",
      type: "Blanco",
      price: "18,50",
      year: "2023",
      description: "Verdejo 2023. Fresco y afrutado. Ideal para mariscos y ensaladas.",
      photos: 1
    },
    {
      id: "wine-3",
      name: "Botella 3",
      type: "Rosado",
      price: "12,00",
      year: "2023",
      description: "Rosado joven 2023. Ligero y afrutado. Perfecto para aperitivos.",
      photos: 2
    }
  ];
}

function saveWines() {
  localStorage.setItem(storageKey, JSON.stringify(wines));
}

function render() {
  const sorted = [...wines].sort(sorters[elements.sort.value]);
  elements.list.innerHTML = sorted.map((wine, index) => createWineCard(wine, index)).join("");
  renderMetrics();
}

const sorters = {
  name: (a, b) => a.name.localeCompare(b.name, "es"),
  price: (a, b) => toNumber(a.price) - toNumber(b.price),
  year: (a, b) => Number(b.year) - Number(a.year)
};

function renderMetrics() {
  elements.total.textContent = wines.length;
  elements.red.textContent = wines.filter((wine) => wine.type === "Tinto").length;
  elements.white.textContent = wines.filter((wine) => wine.type === "Blanco").length;
  elements.rose.textContent = wines.filter((wine) => wine.type === "Rosado").length;
}

function createWineCard(wine, index) {
  const cardClass = typeClass[wine.type] || "red";
  const lowerType = wine.type.toLowerCase();
  return `
    <article class="wine-card ${cardClass}">
      <div class="wine-index">${index + 1}</div>
      <div class="bottle-stage" aria-hidden="true">
        <div class="bottle"><span class="cap"></span></div>
      </div>
      <div class="wine-info">
        <button class="more-button" type="button" aria-label="Mas opciones">⋮</button>
        <h2>${escapeHtml(wine.name)}</h2>
        <p>Vino ${escapeHtml(lowerType)}</p>
        <hr>
        <div class="wine-facts">
          ${fact(iconGrapes(), "Color", `Vino ${lowerType}`)}
          ${fact(iconTag(), "Precio", `${escapeHtml(wine.price)} €`)}
          ${fact(iconDoc(), "Descripcion", escapeHtml(wine.description))}
          ${fact(iconCamera(), "Foto", `${wine.photos} ${wine.photos === 1 ? "imagen" : "imagenes"}`)}
        </div>
      </div>
    </article>
  `;
}

function fact(icon, label, value) {
  return `
    <div class="wine-fact">
      ${icon}
      <strong>${label}</strong>
      <span>${value}</span>
    </div>
  `;
}

function iconGrapes() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="2.5"/><circle cx="14" cy="8" r="2.5"/><circle cx="11.5" cy="12" r="2.5"/><circle cx="8.5" cy="16" r="2.5"/><path d="M14 4c1.5 0 3-.6 4-2"/></svg>';
}

function iconTag() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12 12 20 4 12V4h8l8 8Z"/><path d="M8 8h.01"/></svg>';
}

function iconDoc() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>';
}

function iconCamera() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h4l2-3h4l2 3h4v11H4z"/><circle cx="12" cy="13" r="3"/></svg>';
}

function toNumber(value) {
  return Number(String(value).replace(",", ".").replace(/[^\d.]/g, "")) || 0;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

render();

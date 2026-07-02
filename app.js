const storageKey = "bodega-baco-catalogo-v2";

const typeClass = {
  Tinto: "red",
  Blanco: "white",
  Rosado: "rose"
};

const wines = loadWines();
let activeFilter = "Todos";

const elements = {
  list: document.querySelector("#wineList"),
  sort: document.querySelector("#sortSelect"),
  total: document.querySelector("#totalBottles"),
  red: document.querySelector("#redCount"),
  white: document.querySelector("#whiteCount"),
  rose: document.querySelector("#roseCount"),
  drawerTotal: document.querySelector("#drawerTotal"),
  menu: document.querySelector("#menuDrawer"),
  menuButton: document.querySelector("#menuButton"),
  closeMenu: document.querySelector("#closeMenuButton"),
  drawerAdd: document.querySelector("#drawerAddButton"),
  searchButton: document.querySelector("#searchButton"),
  searchPanel: document.querySelector("#searchPanel"),
  searchInput: document.querySelector("#searchInput"),
  dialog: document.querySelector("#wineDialog"),
  form: document.querySelector("#wineForm"),
  add: document.querySelector("#addButton"),
  cancel: document.querySelector("#cancelButton")
};

elements.sort.addEventListener("change", render);
elements.add.addEventListener("click", () => elements.dialog.showModal());
elements.drawerAdd.addEventListener("click", () => {
  closeMenu();
  elements.dialog.showModal();
});
elements.cancel.addEventListener("click", () => elements.dialog.close());
elements.menuButton.addEventListener("click", openMenu);
elements.closeMenu.addEventListener("click", closeMenu);
elements.menu.addEventListener("click", (event) => {
  if (event.target === elements.menu) closeMenu();
});
elements.searchButton.addEventListener("click", () => {
  elements.searchPanel.hidden = !elements.searchPanel.hidden;
  if (!elements.searchPanel.hidden) elements.searchInput.focus();
});
elements.searchInput.addEventListener("input", render);
document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((item) => item.classList.toggle("active", item === button));
    closeMenu();
    render();
  });
});

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
    grape: data.type === "Blanco" ? "Airen" : data.type === "Rosado" ? "Garnacha" : "Tempranillo",
    label: "BACO",
    range: "Nueva seleccion",
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
      id: "baco-tempranillo",
      name: "Baco Tempranillo",
      type: "Tinto",
      price: "16,90",
      year: "2021",
      grape: "Tempranillo",
      label: "BACO",
      range: "Seleccion Roble",
      description: "Tinto de corte manchego con fruta negra, vainilla fina y tanino pulido. Pensado para carta de restaurante y venta directa.",
      photos: 3
    },
    {
      id: "baco-airen",
      name: "Baco Airen",
      type: "Blanco",
      price: "9,80",
      year: "2024",
      grape: "Airen",
      label: "BACO",
      range: "Vendimia Nocturna",
      description: "Blanco limpio y fresco, con pera, flor blanca y final citrico. Referencia de rotacion para tapeo, mariscos y aperitivo.",
      photos: 2
    },
    {
      id: "baco-garnacha-rose",
      name: "Baco Garnacha Rose",
      type: "Rosado",
      price: "11,40",
      year: "2024",
      grape: "Garnacha",
      label: "BACO",
      range: "Flor de Baco",
      description: "Rosado palido de perfil gastronomico, con fresa silvestre, piel de naranja y final seco. Ideal para terraza y cocina mediterranea.",
      photos: 2
    }
  ];
}

function saveWines() {
  localStorage.setItem(storageKey, JSON.stringify(wines));
}

function render() {
  const filtered = getFilteredWines();
  const sorted = [...filtered].sort(sorters[elements.sort.value]);
  elements.list.innerHTML = sorted.map((wine, index) => createWineCard(wine, index)).join("");
  renderMetrics();
}

function getFilteredWines() {
  const query = elements.searchInput.value.trim().toLowerCase();
  return wines.filter((wine) => {
    const matchesType = activeFilter === "Todos" || wine.type === activeFilter;
    const haystack = [wine.name, wine.type, wine.year, wine.grape, wine.range, wine.description].join(" ").toLowerCase();
    return matchesType && (!query || haystack.includes(query));
  });
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
  elements.drawerTotal.textContent = wines.length;
}

function createWineCard(wine, index) {
  const cardClass = typeClass[wine.type] || "red";
  const lowerType = wine.type.toLowerCase();
  return `
    <article class="wine-card ${cardClass}">
      <div class="wine-index">${index + 1}</div>
      <div class="bottle-stage" aria-hidden="true">
        <div class="bottle">
          <span class="cap"></span>
          <span class="neck-label">${escapeHtml(wine.year)}</span>
          <span class="main-label">
            <b>${escapeHtml(wine.label || "BACO")}</b>
            <small>${escapeHtml(wine.range || wine.grape || wine.type)}</small>
          </span>
        </div>
      </div>
      <div class="wine-info">
        <button class="more-button" type="button" aria-label="Mas opciones">⋮</button>
        <h2>${escapeHtml(wine.name)}</h2>
        <p>${escapeHtml(wine.range || `Vino ${lowerType}`)}</p>
        <hr>
        <div class="wine-facts">
          ${fact(iconGrapes(), "Color", `Vino ${lowerType}`)}
          ${fact(iconBottle(), "Uva", escapeHtml(wine.grape || "Seleccion de la bodega"))}
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

function iconBottle() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2h4v6l2 3v10H8V11l2-3V2Z"/><path d="M10 6h4"/></svg>';
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

function openMenu() {
  elements.menu.classList.add("open");
  elements.menu.setAttribute("aria-hidden", "false");
}

function closeMenu() {
  elements.menu.classList.remove("open");
  elements.menu.setAttribute("aria-hidden", "true");
}

render();

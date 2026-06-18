
const DEFAULT_PDF_LETTERHEAD = {
  leftLogo: "pdf-assets/ac-general-logo.png",
  rightLogo: "pdf-assets/gator-100-logo.png",
  titleLine1: "Commercial Mechanical",
  titleLine2: "Industrial Refrigeration",
  address: "401 Agmac Avenue, Jacksonville, FL 32254",
  phoneFax: "Phone (904) 783-4200  Fax (904) 781-0806",
  website: "acgeneral.net",
  license: "CMC1250807",
  companyName: "AC General",
  documentTitle: "MATERIAL PROCUREMENT REQUEST",
  footerMessage: "Thank you for using the Material Order App!"
};

function mergePdfLetterhead(settings) {
  return { ...DEFAULT_PDF_LETTERHEAD, ...(settings && settings.pdfLetterhead ? settings.pdfLetterhead : {}) };
}

function getAppSettings() {
  const defaults = {
    companyTitle: "AC General",
    mainPageTitle: "Jobs",
    webpageTitle: "Material Orders",
    googleAppsScriptUrl: "https://script.google.com/macros/s/AKfycbwUTdmg06ygEMLTSQ6qRd1uaheqvNQbOh3d45UZX_clnWP2OHmUKwM5UiWVIdmX8kCj/exec",
    senderEmail: "",
    dailyReportCcEmail: "",
    pdfLetterhead: DEFAULT_PDF_LETTERHEAD
  };

  const saved = localStorage.getItem("materialOrderSettings");
  if (!saved) {
    localStorage.setItem("materialOrderSettings", JSON.stringify(defaults));
    return defaults;
  }

  try {
    const parsed = JSON.parse(saved);
    return { ...defaults, ...parsed, pdfLetterhead: mergePdfLetterhead(parsed) };
  } catch {
    return defaults;
  }
}

function applyAppSettings() {
  const settings = getAppSettings();
  const companyTitle = document.getElementById("companyTitle");
  if (companyTitle) companyTitle.textContent = settings.companyTitle || "AC General";

  const mainPageTitle = document.getElementById("mainPageTitle");
  if (mainPageTitle) mainPageTitle.textContent = settings.mainPageTitle || "Jobs";

  document.title = settings.webpageTitle || `${settings.companyTitle || "AC General"} - Material Orders`;
}

const ORDER_EMAIL = "nmcdonald@acgeneral.net";

const DEFAULT_JOBS = [
  { name: "DCPS Spring Park", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "UF Jax Bay Street", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "FSDB", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "NE Park", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "SMA", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "RR", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "Other Job", active: true, email: "nmcdonald@acgeneral.net" }
];

function getStoredJobs() {
  const saved = localStorage.getItem("materialOrderJobs");
  if (!saved) {
    localStorage.setItem("materialOrderJobs", JSON.stringify(DEFAULT_JOBS));
    return DEFAULT_JOBS;
  }

  try {
    const jobs = JSON.parse(saved);
    return Array.isArray(jobs) ? jobs : DEFAULT_JOBS;
  } catch {
    return DEFAULT_JOBS;
  }
}

function getActiveJobs() {
  return getStoredJobs().filter(job => job.active !== false).map(job => job.name);
}


function getJobEmail(jobName) {
  try {
    const savedJobs = localStorage.getItem("materialOrderJobs");
    const jobs = savedJobs ? JSON.parse(savedJobs) : [];
    const selected = jobs.find(job => String(job.name || "").trim() === String(jobName || "").trim());

    if (selected && selected.email && String(selected.email).trim()) {
      return String(selected.email).trim();
    }
  } catch (error) {
    console.warn("Could not find job email.", error);
  }

  return "nmcdonald@acgeneral.net";
}


const standardSizes = ['1/4"', '3/8"', '1/2"'];

const DEFAULT_CATEGORIES = {
  hanging: {
    label: "Hanging Material",
    items: [
      { icon: "icons/nut.png", name: "Nuts", options: standardSizes, units: ["Box", "Each"] },
      { icon: "icons/bolt.png", name: "Bolts", options: ["TDC Bolt"], units: ["Box", "Each"] },
      { icon: "icons/washer.png", name: "Washers", options: standardSizes, units: ["Box", "Each"] },
      { icon: "icons/allthread.png", name: "All Thread", options: standardSizes, units: ["Bundle", "Stick", "Each"] },
      { icon: "icons/unistrut.png", name: "Unistrut", options: ["1-5/8 x 10 ft"], units: ["Bundle", "Stick", "Each"] },
      { icon: "icons/beamclamp.png", name: "Beam Clamps", options: standardSizes, units: ["Box", "Each"] }
    ]
  },
  fasteners: {
    label: "Fasteners",
    items: [
            { icon: "icons/bolt.png", name: "Self Tapping Screws", options: ['5/16"', '#14 x 5" Self-Drilling TEK 5 Curb Screw'], units: ["Box", "Each"] },
      { icon: "icons/bolt.png", name: "Tapcons", options: ['1/4" - 1"', '1/4" - 1.5"', '1/4" - 2"', '1/4" - 2.5"', '1/4" - 3"', '1/4" - 3.5"', '1/4" - 4"'], units: ["Box", "Each"] },
      { icon: "icons/beamclamp.png", name: "Anchors", units: ["Box", "Each"] },
      { icon: "icons/washer.png", name: "Fender Washers", units: ["Box", "Each"] }
    ]
  },
  duct: {
    label: "Duct Material",
    items: [
      { icon: "icons/ductseal.png", name: "Duct Seal", units: ["Bucket", "Pallet"] },
      { icon: "icons/blue-wrap.png", name: "Foil Tape", units: ["Each", "Box"] },
      { icon: "icons/flexduct.png", name: "Flex Duct", options: ['6"', '8"', '10"', '12"', '14"', '16"'], units: ["Each"] },
      { icon: "icons/flexduct.png", name: "Duct Wrap", units: ["Each"] },
      { icon: "icons/ducthanger.png", name: "Drive Cleat", units: ["Bundle", "Stick"] },
      { icon: "icons/ducthanger.png", name: "S-Lock", units: ["Bundle", "Stick"] },
      { icon: "icons/ducthanger.png", name: "Pittsburgh", units: ["Bundle", "Stick"] },
      { icon: "icons/ducthanger.png", name: "Hanger Strap", units: ["Roll", "Box"] }
    ]
  },
  pipe: {
    label: "Pipe & Fittings",
    items: [
      { icon: "│", name: "Copper Pipe", units: ["Stick", "Bundle", "Each"] },
      { icon: "│", name: "PVC Pipe", units: ["Stick", "Bundle", "Each"] },
      { icon: "◯", name: "Pipe Insulation", units: ["Box", "Stick", "Each"] },
      { icon: "🪣", name: "PVC Glue", units: ["Can", "Box", "Each"] },
      { icon: "🪣", name: "Primer", units: ["Can", "Box", "Each"] },
      { icon: "🔧", name: "Pipe Clamps", units: ["Box", "Each"] }
    ]
  },
  tools: {
    label: "Tools & Consumables",
    items: [
      { icon: "icons/Pins.png", name: "Pins", options: ['1"', '1-1/4"', '1-1/2"', '2"'], units: ["Box", "Each"] },
      { icon: "icons/Shots.png", name: "Shots", options: ["Green", "Yellow", "Red"], units: ["Box", "Each"] },
      { icon: "icons/Sawzallblades.png", name: "Sawzall Blades", options: ["Metal", "Demo", "Fine Tooth"], units: ["Pack", "Each"] },
      { icon: "icons/Drillbits.png", name: "Drill Bits", options: ['1/4"', '3/8"', '1/2"'], units: ["Each", "Pack"] },
      { icon: "icons/holesaw.png", name: "Hole Saws", options: ['2"', '3"', '4"', '6"'], units: ["Each"] },
      { icon: "icons/blue-wrap.png", name: "Blue Wrap", options: ['24"', '36"'], units: ["Roll", "Each"] },
      { icon: "icons/gloves.png", name: "Gloves", units: ["Box", "Pair", "Each"] },
      { icon: "icons/Safteyglasses.png", name: "Safety Glasses", units: ["Box", "Pair", "Each"] },
    ]
  }
};

function cleanCategories(categories) {
  const cleaned = categories && typeof categories === "object" ? { ...categories } : {};
  delete cleaned.other;
  return cleaned;
}

function parseMaterialListValue(value) {
  return String(value || "")
    .split(",")
    .map(part => part.trim())
    .filter(Boolean);
}


function buildCategoriesFromCategoryRows(categoryRows) {
  const nextCategories = {};
  if (!Array.isArray(categoryRows)) return nextCategories;

  const sortedRows = [...categoryRows].sort((a, b) => Number(a.sortOrder ?? a.SortOrder ?? 999999) - Number(b.sortOrder ?? b.SortOrder ?? 999999));

  sortedRows.forEach(row => {
    const activeValue = String(row.active ?? row.Active ?? "TRUE").trim().toLowerCase();
    if (activeValue === "false" || activeValue === "no" || activeValue === "0" || activeValue === "inactive") return;

    const category = String(row.category ?? row.Category ?? "").trim();
    const categoryLabel = String(row.categoryLabel ?? row["Category Label"] ?? row.CategoryLabel ?? category).trim();
    if (!category) return;

    nextCategories[category] = {
      label: categoryLabel || category,
      items: []
    };
  });

  return nextCategories;
}


function buildCategoriesFromMaterialsRows(rows, categoryRows) {
  const nextCategories = buildCategoriesFromCategoryRows(categoryRows);
  const hasCategorySheet = Object.keys(nextCategories).length > 0;

  if (!Array.isArray(rows)) return hasCategorySheet ? nextCategories : null;

  rows.forEach(row => {
    const activeValue = String(row.active ?? row.Active ?? "TRUE").trim().toLowerCase();
    if (activeValue === "false" || activeValue === "no" || activeValue === "0" || activeValue === "inactive") return;

    const category = String(row.category ?? row.Category ?? "").trim();
    const categoryLabel = String(row.categoryLabel ?? row["Category Label"] ?? row.CategoryLabel ?? category).trim();
    const material = String(row.material ?? row.Material ?? "").trim();
    if (!category || !material) return;

    // If MaterialCategories exists, do NOT create old categories from the Materials tab.
    if (hasCategorySheet && !nextCategories[category]) return;

    if (!nextCategories[category]) {
      nextCategories[category] = {
        label: categoryLabel || category,
        items: []
      };
    }

    const item = {
      icon: String(row.icon ?? row.Icon ?? "").trim() || "📦",
      name: material,
      units: parseMaterialListValue(row.units ?? row.Units)
    };

    if (!item.units.length) item.units = ["Each"];

    const options = parseMaterialListValue(row.options ?? row.Options);
    if (options.length) item.options = options;

    const customValue = String(row.custom ?? row.Custom ?? "").trim().toLowerCase();
    if (customValue === "true" || customValue === "yes" || customValue === "1") {
      item.custom = true;
      item.placeholder = String(row.placeholder ?? row.Placeholder ?? "Type what material you need here...").trim();
    }

    const noteRequiredValue = String(
      row.noteRequired ??
      row.notesEnabled ??
      row["Note Required"] ??
      row["Notes Enabled"] ??
      row["Notes Enabled?"] ??
      row.RequiresNote ??
      row["Requires Note"] ??
      row.NotesRequired ??
      ""
    ).trim().toLowerCase();
    if (["true", "yes", "1", "y", "enabled", "on"].includes(noteRequiredValue)) {
      item.noteRequired = true;
    }

    nextCategories[category].items.push(item);
  });

  return Object.keys(nextCategories).length ? nextCategories : null;
}

async function loadMaterialsFromGoogleSheet() {
  const url = typeof getGoogleAppsScriptUrl === "function" ? getGoogleAppsScriptUrl() : "";
  if (!url) return false;

  try {
    const response = await fetch(url + "?action=materials&v=" + Date.now(), { cache: "no-store" });
    const data = await response.json();
    const sheetCategories = buildCategoriesFromMaterialsRows(data.materials || [], data.materialCategories || []);
    if (!sheetCategories) return false;

    localStorage.setItem("materialOrderCategories", JSON.stringify(cleanCategories(sheetCategories)));
    categories = getStoredCategories();

    if (categories.hanging) {
      activeCategory = "hanging";
    } else if (!categories[activeCategory]) {
      activeCategory = Object.keys(categories)[0] || "hanging";
    }
    if (typeof renderCategories === "function") renderCategories();
    if (typeof renderMaterials === "function") renderMaterials();
    if (typeof renderQuickOrder === "function") renderQuickOrder();
    return true;
  } catch (error) {
    console.warn("Could not load Materials tab from Google Sheet. Using local/app-data materials.", error);
    return false;
  }
}

function getStoredCategories() {
  const saved = localStorage.getItem("materialOrderCategories");

  if (!saved) {
    localStorage.setItem("materialOrderCategories", JSON.stringify(cleanCategories(DEFAULT_CATEGORIES)));
    return JSON.parse(JSON.stringify(cleanCategories(DEFAULT_CATEGORIES)));
  }

  try {
    const categories = JSON.parse(saved);
    const cleaned = categories && typeof categories === "object" ? cleanCategories(categories) : cleanCategories(DEFAULT_CATEGORIES);
    localStorage.setItem("materialOrderCategories", JSON.stringify(cleaned));
    return cleaned;
  } catch {
    return JSON.parse(JSON.stringify(cleanCategories(DEFAULT_CATEGORIES)));
  }
}

let categories = getStoredCategories();

function refreshCategoriesFromStorage() {
  categories = getStoredCategories();
  renderCategories();
  renderMaterials();
}


let activeCategory = "hanging";
let selectedOptions = {};
let selectedUnits = {};
let draftQty = {};
let qtyResetLock = {};
let customDrafts = {};
let materialNoteDrafts = {};
let cart = [];
let selectedPriority = "Normal";
let currentSelectedJob = localStorage.getItem("materialOrderSelectedJob") || "";


const MATERIAL_CATEGORY_ORDER = ["hanging", "fasteners", "tools", "duct", "pipe"];

function categorySortIndex(key) {
  const index = MATERIAL_CATEGORY_ORDER.indexOf(String(key || ""));
  return index === -1 ? 999 : index;
}

function sortCategoryEntries(categoriesObject) {
  return Object.entries(categoriesObject || {}).sort(([aKey, aCat], [bKey, bCat]) => {
    const ai = categorySortIndex(aKey);
    const bi = categorySortIndex(bKey);
    if (ai !== bi) return ai - bi;
    return String((aCat && aCat.label) || aKey).localeCompare(String((bCat && bCat.label) || bKey));
  });
}


function safeText(text) {
  return String(text || "")
    .split("&").join("&amp;")
    .split("<").join("&lt;")
    .split(">").join("&gt;")
    .split('"').join("&quot;")
    .split("'").join("&#039;");
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  const screen = document.getElementById(id);
  if (screen) screen.classList.add("active");

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.screen === id);
  });
  if (typeof updateFloatingCartButton === "function") updateFloatingCartButton();
}

window.showScreen = showScreen;

function setPriority(priority) {
  selectedPriority = priority;
  const select = document.getElementById("reviewPrioritySelect");
  if (select) {
    select.value = priority;
    updatePriorityColor();
  }
}

function updatePriorityColor() {
  const select = document.getElementById("reviewPrioritySelect");
  if (!select) return;
  select.classList.remove("priority-normal", "priority-rush", "priority-emergency");

  if (select.value === "Normal") {
    select.classList.add("priority-normal");
  } else if (select.value === "Rush") {
    select.classList.add("priority-rush");
  } else {
    select.classList.add("priority-emergency");
  }
}

function setSelectedJob(job) {
  currentSelectedJob = job || "";
  if (currentSelectedJob) {
    localStorage.setItem("materialOrderSelectedJob", currentSelectedJob);
  }
  const selectedJob = document.getElementById("selectedJob");
  if (selectedJob && currentSelectedJob) {
    selectedJob.value = currentSelectedJob;
  }
}

function selectJob(job) {
  setSelectedJob(job);
  updateJobActionScreen();
  showScreen("jobActionScreen");
}

function renderJobs() {
  const searchInput = document.getElementById("jobSearch");
  const q = searchInput ? searchInput.value.toLowerCase() : "";
  const list = getActiveJobs().filter(job => job.toLowerCase().includes(q));
  const jobList = document.getElementById("recentOrders") || document.getElementById("jobList");
  if (!jobList) return;

  jobList.innerHTML = list.map((job, index) => `
    <button class="job-card" data-job="${safeText(job)}" type="button">
      <div class="job-thumb">📋</div>
      <div>
        <h3>${safeText(job)}</h3>
        <span class="job-meta">Material order ready</span>
      </div>
      <span class="job-status">● Active</span>
      <div class="chev">›</div>
    </button>
  `).join("");

  document.querySelectorAll(".job-card").forEach(button => {
    button.addEventListener("click", () => selectJob(button.dataset.job));
  });
}

function renderJobSelect() {
  const selectedJob = document.getElementById("selectedJob");
  if (!selectedJob) return;

  const jobs = getActiveJobs();
  const previousValue = currentSelectedJob || selectedJob.value || localStorage.getItem("materialOrderSelectedJob") || jobs[0] || "";

  selectedJob.innerHTML = jobs.map(job => `<option value="${safeText(job)}">${safeText(job)}</option>`).join("");

  if (previousValue && jobs.includes(previousValue)) {
    selectedJob.value = previousValue;
    currentSelectedJob = previousValue;
  } else if (jobs.length) {
    selectedJob.value = jobs[0];
    currentSelectedJob = jobs[0];
  }

  if (currentSelectedJob) {
    localStorage.setItem("materialOrderSelectedJob", currentSelectedJob);
  }

  selectedJob.onchange = () => setSelectedJob(selectedJob.value);
}

function renderCategories() {
  const sortedEntries = sortCategoryEntries(categories);
  if (!categories[activeCategory]) activeCategory = (sortedEntries[0] && sortedEntries[0][0]) || "hanging";
  const tabs = document.getElementById("categoryTabs");
  if (tabs) {
    tabs.innerHTML = sortedEntries.map(([key, cat]) => `
      <button class="chip ${key === activeCategory ? "active" : ""}" data-category="${key}" type="button">${safeText(cat.label)}</button>
    `).join("");

    document.querySelectorAll(".chip").forEach(button => {
      button.addEventListener("click", () => setCategory(button.dataset.category));
    });
  }
  renderQuickOrder();
}

function renderQuickOrder() {
  const quick = document.getElementById("quickOrder");
  if (!quick) return;
  const icons = ["🔩", "▰", "│", "◉", "•••"];
  const entries = sortCategoryEntries(categories).slice(0, 5);
  quick.innerHTML = entries.map(([key, cat], index) => `
    <button class="quick-card ${key === activeCategory ? "active" : ""}" data-category="${key}" type="button">
      <span>${icons[index] || "📦"}</span>${safeText(cat.label)}
    </button>
  `).join("");
  document.querySelectorAll(".quick-card").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      showScreen("orderScreen");
      renderCategories();
      renderMaterials();
    });
  });
}

function setCategory(key) {
  activeCategory = key;
  renderCategories();
  renderMaterials();
}

function getItem(category, itemName) {
  return categories[category].items.find(i => i.name === itemName);
}

function baseKey(item) {
  return `${activeCategory}:${item.name}`;
}

function getSelectedOption(item) {
  if (!item.options) return "";
  const key = baseKey(item);
  if (!selectedOptions[key]) selectedOptions[key] = item.options[0];
  return selectedOptions[key];
}

function getSelectedUnit(item) {
  const key = baseKey(item);
  const units = item.units || ["Each"];
  if (!selectedUnits[key]) selectedUnits[key] = units[0];
  return selectedUnits[key];
}

function getDraftQty(item) {
  const key = baseKey(item);
  if (!draftQty[key]) draftQty[key] = 0;
  return draftQty[key];
}

function getCustomDraft(item) {
  const key = baseKey(item);
  return customDrafts[key] || "";
}

function changeCustomDraft(itemName, value) {
  const item = getItem(activeCategory, itemName);
  if (!item) return;
  customDrafts[baseKey(item)] = value;
}

function getMaterialNoteDraft(item) {
  const key = baseKey(item);
  return materialNoteDrafts[key] || "";
}

function changeMaterialNoteDraft(itemName, value) {
  const item = getItem(activeCategory, itemName);
  if (!item) return;
  materialNoteDrafts[baseKey(item)] = value;
}

function changeOption(itemName, value) {
  const item = getItem(activeCategory, itemName);
  if (!item) return;
  selectedOptions[baseKey(item)] = value;
  renderMaterials();
}

function changeUnit(itemName, value) {
  const item = getItem(activeCategory, itemName);
  if (!item) return;
  selectedUnits[baseKey(item)] = value;
}


function forceResetAllQtyInputs() {
  Object.keys(draftQty).forEach(key => {
    draftQty[key] = 0;
    qtyResetLock[key] = true;
  });

  document.querySelectorAll(".qty-number-input").forEach(input => {
    input.value = 0;
    input.defaultValue = 0;
    input.setAttribute("value", "0");
  });

  setTimeout(() => {
    document.querySelectorAll(".qty-number-input").forEach(input => {
      input.value = 0;
      input.defaultValue = 0;
      input.setAttribute("value", "0");
    });
  }, 100);

  setTimeout(() => {
    Object.keys(qtyResetLock).forEach(key => qtyResetLock[key] = false);
    Object.keys(draftQty).forEach(key => draftQty[key] = 0);
    renderMaterials();
  }, 300);
}

function changeDraftQty(itemName, amount) {
  const item = getItem(activeCategory, itemName);
  if (!item) return;
  const key = baseKey(item);
  const current = draftQty[key] || 0;
  draftQty[key] = Math.max(0, current + amount);
  renderMaterials();
}

function addToCart(itemName) {
  const item = getItem(activeCategory, itemName);
  if (!item) return;

  const key = baseKey(item);
  const qty = draftQty[key] || 0;
  if (qty <= 0) {
    const selectedJob = document.getElementById("selectedJob");
    if (selectedJob) setSelectedJob(selectedJob.value);
    alert("Please add a quantity before adding to cart.");
    showScreen("orderScreen");
    return;
  }

  const option = getSelectedOption(item);
  const unit = getSelectedUnit(item);
  const customText = item.custom ? getCustomDraft(item).trim() : "";
  const itemNotes = getMaterialNoteDraft(item).trim();

  if (item.custom && !customText) {
    alert("Please type the custom material you need before adding to cart.");
    showScreen("orderScreen");
    return;
  }

  if (item.noteRequired && !itemNotes) {
    alert("Please type notes for this material before adding it to the cart.");
    showScreen("orderScreen");
    return;
  }

  const orderItemName = item.custom ? customText : item.name;
  const cartKey = item.custom
    ? `${activeCategory}:${item.name}:${customText}:${unit}:${itemNotes}`
    : `${activeCategory}:${item.name}:${option}:${unit}:${itemNotes}`;

  const existing = cart.find(line => line.cartKey === cartKey);
  if (existing) {
    existing.qty += qty;
    if (itemNotes) existing.notes = itemNotes;
  } else {
    cart.push({
      cartKey,
      category: activeCategory,
      categoryLabel: categories[activeCategory].label,
      name: orderItemName,
      option: item.custom ? "" : option,
      unit,
      qty,
      notes: itemNotes,
      custom: !!item.custom
    });
  }

  draftQty[key] = 0;
  if (item.custom) customDrafts[key] = "";
  materialNoteDrafts[key] = "";
  renderMaterials();
  renderCartPreview();
}

function removeCartItem(cartKey) {
  cart = cart.filter(item => item.cartKey !== cartKey);
  renderCartPreview();
}

function displayName(item) {
  return item.option ? `${item.name} - ${item.option}` : item.name;
}

function renderCartPreview() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const countEl = document.getElementById("cartCount");
  const previewEl = document.getElementById("cartPreview");

  if (countEl) countEl.textContent = `${count} item${count === 1 ? "" : "s"}`;

  if (!previewEl) return;

  if (cart.length === 0) {
    previewEl.className = "cart-preview-empty";
    previewEl.innerHTML = "Nothing added yet.";
    return;
  }

  previewEl.className = "cart-preview-list";
  previewEl.innerHTML = cart.map(item => `
    <div class="cart-line">
      <div>
        <strong>${safeText(displayName(item))}</strong>
        <span>${safeText(item.categoryLabel)}${item.notes ? " • Notes: " + safeText(item.notes) : ""}</span>
      </div>
      <div class="cart-line-right">
        <b>${item.qty} ${safeText(item.unit)}</b>
        <button type="button" data-cart-key="${safeText(item.cartKey)}">×</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-cart-key]").forEach(button => {
    button.addEventListener("click", () => removeCartItem(button.dataset.cartKey));
  });
}


function renderMaterialIcon(icon) {
  const value = String(icon || "");
  if (
    value.includes("/") ||
    value.endsWith(".png") ||
    value.endsWith(".jpg") ||
    value.endsWith(".jpeg") ||
    value.endsWith(".svg") ||
    value.endsWith(".webp")
  ) {
    return `<img class="material-icon-img" src="${safeText(value)}" alt="" loading="lazy" />`;
  }
  return safeText(value);
}

function renderMaterials() {
  if (!categories[activeCategory]) activeCategory = Object.keys(categories)[0] || "hanging";
  const searchText = ((document.getElementById("materialSearch") || {}).value || "").trim().toLowerCase();
  const allItems = categories[activeCategory].items || [];
  const items = searchText ? allItems.filter(item => `${item.name || ""} ${(item.options || []).join(" ")}`.toLowerCase().includes(searchText)) : allItems;
  const materialList = document.getElementById("materialList");
  if (!materialList) return;

  materialList.innerHTML = items.map(item => {
    const qty = getDraftQty(item);

    const customInput = item.custom ? `
      <label class="select-label custom-material-label">
        Material Needed
        <textarea class="custom-material-input" data-item="${safeText(item.name)}" placeholder="${safeText(item.placeholder || "Type what material you need here...")}">${safeText(getCustomDraft(item))}</textarea>
      </label>
    ` : "";

    const noteInput = item.noteRequired ? `
      <label class="select-label material-note-label required-note">
        Notes (Required)
        <textarea class="material-note-input" data-note-item="${safeText(item.name)}" placeholder="Type notes for this material...">${safeText(getMaterialNoteDraft(item))}</textarea>
      </label>
    ` : "";

    const sizeSelect = !item.custom && item.options ? `
      <label class="select-label">
        Size
        <select class="variant-select" data-item="${safeText(item.name)}">
          ${item.options.map(option => `<option ${getSelectedOption(item) === option ? "selected" : ""}>${safeText(option)}</option>`).join("")}
        </select>
      </label>
    ` : "";

    const unitSelect = `
      <label class="select-label unit-label">
        Unit
        <select class="unit-select" data-item="${safeText(item.name)}">
          ${(item.units || ["Each"]).map(unit => `<option ${getSelectedUnit(item) === unit ? "selected" : ""}>${safeText(unit)}</option>`).join("")}
        </select>
      </label>
    `;

    return `
      <div class="material-row cart-style-row">
        <div class="material-icon">${renderMaterialIcon(item.icon)}</div>
        <div class="material-info">
          <div class="material-name">${safeText(item.name)}</div>
          ${customInput}
          <div class="select-row mobile-full-controls">
            ${sizeSelect}
            ${unitSelect}
          </div>
        </div>

        <div class="qty-control">
          <button class="minus-btn" data-item="${safeText(item.name)}" type="button">−</button>
          <input class="qty-number-input" data-qty-number="${safeText(item.name)}" type="number" inputmode="numeric" pattern="[0-9]*" min="0" value="${qty}" />
          <button class="plus plus-btn" data-item="${safeText(item.name)}" type="button">+</button>
        </div>

        <button class="add-cart-btn add-cart-wide" data-item="${safeText(item.name)}" type="button">Add to Cart</button>
        ${noteInput}
      </div>
    `;
  }).join("");

  document.querySelectorAll(".custom-material-input").forEach(input => {
    input.addEventListener("input", () => changeCustomDraft(input.dataset.item, input.value));
  });

  document.querySelectorAll(".material-note-input").forEach(input => {
    input.addEventListener("input", () => changeMaterialNoteDraft(input.dataset.noteItem, input.value));
  });

  document.querySelectorAll(".variant-select").forEach(select => {
    select.addEventListener("change", () => changeOption(select.dataset.item, select.value));
  });

  document.querySelectorAll(".unit-select").forEach(select => {
    select.addEventListener("change", () => changeUnit(select.dataset.item, select.value));
  });

  document.querySelectorAll(".minus-btn").forEach(button => {
    button.addEventListener("click", () => changeDraftQty(button.dataset.item, -1));
  });

  document.querySelectorAll(".plus-btn").forEach(button => {
    button.addEventListener("click", () => changeDraftQty(button.dataset.item, 1));
  });


  document.querySelectorAll(".qty-number-input").forEach(input => {
    input.addEventListener("input", () => {
      const item = getItem(activeCategory, input.dataset.qtyNumber);
      if (!item) return;
      const key = baseKey(item);
      if (qtyResetLock[key]) {
        input.value = 0;
        draftQty[key] = 0;
        return;
      }
      let value = Number(input.value);
      if (!Number.isFinite(value) || value < 0) value = 0;
      draftQty[key] = Math.floor(value);
    });

    input.addEventListener("change", () => {
      const item = getItem(activeCategory, input.dataset.qtyNumber);
      if (!item) return;
      const key = baseKey(item);
      if (qtyResetLock[key]) {
        input.value = 0;
        draftQty[key] = 0;
        return;
      }
      let value = Number(input.value);
      if (!Number.isFinite(value) || value < 0) value = 0;
      value = Math.floor(value);
      draftQty[key] = value;
      input.value = value;
    });

    input.addEventListener("focus", () => {
      setTimeout(() => input.select(), 0);
    });
  });

  document.querySelectorAll(".add-cart-btn").forEach(button => {
    button.addEventListener("click", () => {
      const item = getItem(activeCategory, button.dataset.item);
      if (!item) return;

      const row = button.closest(".material-row");
      const input = row ? row.querySelector(".qty-number-input") : null;
      const key = baseKey(item);

      // Read the typed phone/keyboard value right before adding.
      if (input) {
        let value = Number(input.value);
        if (!Number.isFinite(value) || value < 0) value = 0;
        draftQty[key] = Math.floor(value);
        input.blur();
      }

      addToCart(button.dataset.item);
      forceResetAllQtyInputs();

      // Force this item back to zero after adding.
      draftQty[key] = 0;
      qtyResetLock[key] = true;

      setTimeout(() => {
        draftQty[key] = 0;
        qtyResetLock[key] = false;
        renderMaterials();
      }, 50);
    });
  });
}

function getOrderItems() {
  return cart.map(item => ({
    category: item.category,
    categoryLabel: item.categoryLabel,
    material: item.name,
    option: item.option || "",
    name: displayName(item),
    qty: item.qty,
    unit: item.unit,
    notes: item.notes || ""
  }));
}

function getLoggedInRequesterName() {
  const currentUser = (typeof getCurrentUser === "function") ? getCurrentUser() : null;
  return currentUser ? (currentUser.displayName || currentUser.username || currentUser.email || "") : "";
}

function goReview() {
  const requestedBy = getLoggedInRequesterName();
  if (!requestedBy) {
    alert("Please log in before submitting an order.");
    return;
  }

  const items = getOrderItems();
  if (items.length === 0) {
    alert("Please add at least one item to cart.");
    return;
  }

  const job = document.getElementById("selectedJob").value;
  const notes = document.getElementById("notes").value.trim();

  document.getElementById("reviewJobName").textContent = job;

  const prioritySelect = document.getElementById("reviewPrioritySelect");
  if (prioritySelect) {
    prioritySelect.value = selectedPriority;
    updatePriorityColor();
  }

  document.getElementById("reviewNotes").textContent = notes || "None";
  document.getElementById("reviewTotal").textContent = items.reduce((sum, item) => sum + item.qty, 0);

  document.getElementById("reviewItems").innerHTML = items.map(item => `
    <div class="review-line">
      <span>${safeText(item.name)}</span>
      <strong>${item.qty} ${safeText(item.unit)}</strong>
    </div>
  `).join("");

  showScreen("reviewScreen");
}

function saveOrderToBoard(order) {
  try {
    const saved = localStorage.getItem("materialOrderBoardOrders");
    const orders = saved ? JSON.parse(saved) : [];
    const safeOrders = Array.isArray(orders) ? orders : [];
    safeOrders.unshift(order);
    localStorage.setItem("materialOrderBoardOrders", JSON.stringify(safeOrders));
  } catch (error) {
    console.warn("Could not save order to board.", error);
  }
}


function getGoogleAppsScriptUrl() {
  const directUrl = getSavedScriptUrl();
  if (directUrl) return directUrl;
  const settings = getAppSettings();
  return (settings.googleAppsScriptUrl || "").trim();
}

function saveOrderToGoogleSheet(order) {
  const url = getGoogleAppsScriptUrl();
  if (!url) {
    alert("Google Apps Script URL is missing. Open Admin and paste your /exec URL in the orange Email + PDF Sending Setup box on the dashboard.");
    return Promise.resolve(null);
  }
  try {
    return fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(order)
    }).catch(error => {
      console.warn("Google Sheet save failed.", error);
      return null;
    });
  } catch (error) {
    console.warn("Google Sheet save failed.", error);
    return Promise.resolve(null);
  }
}

function openEmailClientFallback(toEmail, subject, body) {
  try {
    const mailto = `mailto:${encodeURIComponent(toEmail || "")} ?subject=${encodeURIComponent(subject || "Material Order")}&body=${encodeURIComponent(body || "")}`.replace("%20?", "?");
    window.location.href = mailto;
  } catch (error) {
    console.warn("Could not open email app.", error);
  }
}


function makeOrderNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const short = String(Date.now()).slice(-5);
  return `ORD-${y}${m}${d}-${short}`;
}

function fileNameSafe(value) {
  return String(value || "Job").replace(/[\\/:*?"<>|]/g, "-").slice(0, 80);
}

async function imageToDataUrl(value) {
  if (!value) return "";
  if (String(value).startsWith("data:image/")) return value;

  try {
    const response = await fetch(value, { cache: "no-store" });
    if (!response.ok) return "";
    const blob = await response.blob();
    return await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result || "");
      reader.onerror = () => resolve("");
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn("Could not load PDF letterhead image.", error);
    return "";
  }
}

async function getPdfLetterheadForEmail() {
  const settings = getAppSettings();
  const pdfLetterhead = mergePdfLetterhead(settings);
  return {
    ...pdfLetterhead,
    leftLogo: await imageToDataUrl(pdfLetterhead.leftLogo),
    rightLogo: await imageToDataUrl(pdfLetterhead.rightLogo)
  };
}

function buildEmailBody(orderRecord) {
  const lines = (orderRecord.items || []).map(item => `- ${item.name}: ${item.qty} ${item.unit}`).join("\n");
  const companyName = orderRecord.pdfLetterhead && orderRecord.pdfLetterhead.companyName ? orderRecord.pdfLetterhead.companyName : (getAppSettings().companyTitle || "");
  return `${companyName ? companyName + "\n" : ""}Material Order Request

Job: ${orderRecord.job}
Order #: ${orderRecord.orderNumber}
Priority: ${orderRecord.priority}
Requested By: ${orderRecord.requestedBy}
Date: ${new Date(orderRecord.createdAt).toLocaleString()}

Items Needed:
${lines}

Notes:
${orderRecord.notes || "None"}

A branded PDF material form is attached.

Sent from Material Order App`;
}

async function sendEmail() {
  const prioritySelect = document.getElementById("reviewPrioritySelect");
  if (prioritySelect) selectedPriority = prioritySelect.value;

  const job = document.getElementById("selectedJob").value;
  const requestedBy = getLoggedInRequesterName();
  const notes = document.getElementById("notes").value.trim();
  const items = getOrderItems();

  if (!requestedBy || items.length === 0) {
    goReview();
    return;
  }

  const submitBtn = document.getElementById("submitEmailBtn");
  const originalText = submitBtn ? submitBtn.innerHTML : "";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Sending PDF Email...";
  }

  const orderNumber = makeOrderNumber();
  const orderRecord = {
    id: `order-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    orderNumber,
    job,
    deliveryLocation: `${job} Jobsite`,
    requestedBy,
    priority: selectedPriority,
    notes,
    items,
    status: "Pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  saveOrderToBoard(orderRecord);

  const subject = `${selectedPriority === "Emergency" ? "🚨 EMERGENCY - " : selectedPriority === "Rush" ? "RUSH - " : ""}Material Order - ${job} - ${orderNumber}`;
  const body = buildEmailBody(orderRecord);

  const payload = {
    ...orderRecord,
    toEmail: getJobEmail(job),
    fromEmail: (getAppSettings().senderEmail || ""),
    emailSubject: subject,
    emailBody: body,
    sendPdfEmail: true,
    pdfLetterhead: await getPdfLetterheadForEmail()
  };

  await saveOrderToGoogleSheet(payload);

  cart = [];
  renderCartPreview();
  document.getElementById("notes").value = "";

  alert("Order submitted. The branded PDF email was sent through Google Apps Script.");
  showScreen("jobsScreen");

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

function updateJobActionScreen() {
  const jobTitle = document.getElementById("jobActionJobName");
  if (jobTitle) jobTitle.textContent = currentSelectedJob || "Selected Job";
}

function startMaterialOrder() {
  renderJobSelect();
  const selectedJob = document.getElementById("selectedJob");
  if (selectedJob && currentSelectedJob) selectedJob.value = currentSelectedJob;
  showScreen("orderScreen");
}



let rentalItems = [];
let selectedRentalItem = "";
let rentalCart = [];

const DEFAULT_RENTAL_ITEMS = [
  { name: "Conex", icon: "🚚", active: true },
  { name: "Lull", icon: "🚜", active: true, options: ["6k", "8k", "10k", "12k"] },
  { name: "Scissor Lift", icon: "↕️", active: true, options: ["19 ft", "26 ft", "32 ft", "40 ft"] },
  { name: "Boom Lift", icon: "🏗️", active: true, options: ["45 ft", "60 ft", "80 ft", "125 ft"] },
  { name: "Porta John", icon: "🚻", active: true },
  { name: "Other / Custom", icon: "➕", active: true, custom: true }
];

function getStoredRentalItems() {
  try {
    const saved = localStorage.getItem("materialOrderRentalItems");
    if (!saved) {
      localStorage.setItem("materialOrderRentalItems", JSON.stringify(DEFAULT_RENTAL_ITEMS));
      return DEFAULT_RENTAL_ITEMS;
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_RENTAL_ITEMS;
  } catch {
    return DEFAULT_RENTAL_ITEMS;
  }
}

function setStoredRentalItems(items) {
  localStorage.setItem("materialOrderRentalItems", JSON.stringify(items || DEFAULT_RENTAL_ITEMS));
}

function renderRentalItems() {
  const grid = document.getElementById("rentalItemGrid");
  if (!grid) return;

  rentalItems = getStoredRentalItems().filter(item => item.active !== false);
  if (!rentalItems.some(item => item.custom)) {
    rentalItems.push({ name: "Other / Custom", icon: "➕", active: true, custom: true });
  }

  grid.innerHTML = rentalItems.map(item => {
    const key = safeText(item.name);
    return `
      <div class="rental-choice-card ${selectedRentalItem === item.name ? "active" : ""}">
        <button class="rental-choice-btn" data-rental-item="${key}" type="button">
          <span class="material-icon">${renderMaterialIcon(item.icon || "📦")}</span>
          <strong>${safeText(item.name)}</strong>
        </button>

        ${item.options && item.options.length ? `
        <label class="rental-card-qty-label">
          Size
          <select class="rental-card-size-input" data-rental-size-card="${key}">
            ${item.options.map(option => `<option>${safeText(option)}</option>`).join("")}
          </select>
        </label>` : ""}

        <label class="rental-card-qty-label">
          Quantity
          <input class="rental-card-qty-input" data-rental-qty-card="${key}" type="number" inputmode="numeric" min="1" value="1" />
        </label>

        <button class="add-rental-row-btn" data-add-rental="${key}" type="button">Add to Rentals</button>
      </div>
    `;
  }).join("");

  document.querySelectorAll("[data-rental-item]").forEach(button => {
    button.addEventListener("click", () => selectRentalItem(button.dataset.rentalItem));
  });

  document.querySelectorAll("[data-add-rental]").forEach(button => {
    button.addEventListener("click", () => addRentalToList(button.dataset.addRental));
  });

  updateRentalCustomInput();
}

function selectRentalItem(name) {
  selectedRentalItem = name || "";
  renderRentalItems();
}

function updateRentalCustomInput() {
  const input = document.getElementById("rentalItemInput");
  if (!input) return;
  const selected = rentalItems.find(item => item.name === selectedRentalItem);
  const isCustom = selected && selected.custom;
  input.style.display = isCustom ? "block" : "none";
  if (!isCustom) input.value = "";
}

async function loadRentalItemsFromGoogleSheet() {
  const url = typeof getGoogleAppsScriptUrl === "function" ? getGoogleAppsScriptUrl() : "";
  if (!url) return false;

  try {
    const response = await fetch(url + "?action=rentalItems&v=" + Date.now(), { cache: "no-store" });
    const data = await response.json();

    if (Array.isArray(data.rentalItems) && data.rentalItems.length) {
      const items = data.rentalItems.map(item => ({
        name: item.name || item["Rental Item"] || "",
        icon: item.icon || item.Icon || "📦",
        active: !(item.active === false || String(item.active).toLowerCase() === "false"),
        custom: item.custom === true || String(item.custom || "").toLowerCase() === "true",
        options: parseMaterialListValue(item.options || item.Options || item.sizes || item.Sizes)
      })).filter(item => item.name);

      setStoredRentalItems(items);
      if (typeof renderRentalItems === "function") renderRentalItems();
      return true;
    }
  } catch (error) {
    console.warn("Could not load RentalItems tab.", error);
  }
  return false;
}



function getCurrentRentalSelectionName() {
  const selectedRental = getStoredRentalItems().find(item => item.name === selectedRentalItem);
  const customRentalText = ((document.getElementById("rentalItemInput") || {}).value || "").trim();
  return selectedRental && selectedRental.custom ? customRentalText : (selectedRentalItem || customRentalText).trim();
}

function addRentalToList(rentalName) {
  if (rentalName) {
    selectedRentalItem = rentalName;
    updateRentalCustomInput();
  }
  const item = getCurrentRentalSelectionName();
  const cardQtyInput = rentalName ? document.querySelector(`[data-rental-qty-card="${CSS.escape(rentalName)}"]`) : null;
  const cardSizeInput = rentalName ? document.querySelector(`[data-rental-size-card="${CSS.escape(rentalName)}"]`) : null;
  const rentalSize = (cardSizeInput && cardSizeInput.value ? cardSizeInput.value : "").trim();
  const quantityValue = Number((cardQtyInput && cardQtyInput.value) || "1");
  const quantity = Number.isFinite(quantityValue) && quantityValue > 0 ? Math.floor(quantityValue) : 1;

  if (!item) {
    alert("Please select or type a rental item.");
    return;
  }

  const existing = rentalCart.find(line => String(line.rentalItem || "").trim().toLowerCase() === item.toLowerCase() && String(line.rentalSize || "") === rentalSize);
  if (existing) {
    existing.quantity += quantity;
  } else {
    const selectedRental = getStoredRentalItems().find(rental => rental.name === selectedRentalItem);
    rentalCart.push({
      rentalItem: item,
      rentalSize,
      quantity,
      icon: selectedRental ? selectedRental.icon : "📦"
    });
  }
  if (cardQtyInput) cardQtyInput.value = "1";
  const customInput = document.getElementById("rentalItemInput");
  if (customInput) customInput.value = "";

  renderRentalPreview();
}

function removeRentalFromList(index) {
  rentalCart.splice(index, 1);
  renderRentalPreview();
}

function renderRentalPreview() {
  const countEl = document.getElementById("rentalCount");
  const preview = document.getElementById("rentalPreview");
  const total = rentalCart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  if (countEl) countEl.textContent = `${total} rental${total === 1 ? "" : "s"}`;
  if (!preview) return;

  if (!rentalCart.length) {
    preview.className = "cart-preview-empty";
    preview.innerHTML = "Nothing added yet.";
    return;
  }

  preview.className = "cart-preview-list";
  preview.innerHTML = rentalCart.map((item, index) => `
    <div class="cart-line">
      <div>
        <strong>${safeText(item.rentalItem)}${item.rentalSize ? " - " + safeText(item.rentalSize) : ""}</strong>
        <span>Job Site Rental</span>
      </div>
      <div class="cart-line-right">
        <b>Qty ${safeText(item.quantity)}</b>
        <button type="button" data-remove-rental="${index}">×</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-remove-rental]").forEach(button => {
    button.addEventListener("click", () => removeRentalFromList(Number(button.dataset.removeRental)));
  });
}


function startRental() {
  const jobEl = document.getElementById("rentalJob");
  const requestedByEl = document.getElementById("rentalRequestedBy");

  if (jobEl) jobEl.textContent = currentSelectedJob || "Selected Job";
  if (requestedByEl) requestedByEl.textContent = getLoggedInRequesterName() || "Logged-in user";

  ["rentalItemInput", "rentalVendorInput", "rentalNotesInput"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  rentalItems = getStoredRentalItems().filter(item => item.active !== false);
  if (!rentalItems.some(item => item.custom)) rentalItems.push({ name: "Other / Custom", icon: "➕", active: true, custom: true });
  selectedRentalItem = rentalItems[0] ? rentalItems[0].name : "";
  renderRentalItems();

  rentalCart = [];
  renderRentalPreview();

  showScreen("rentalScreen");
}

async function submitRental() {
  const job = currentSelectedJob || (document.getElementById("selectedJob") ? document.getElementById("selectedJob").value : "");
  const requestedBy = getLoggedInRequesterName();
  const vendor = ((document.getElementById("rentalVendorInput") || {}).value || "").trim();
  const notes = ((document.getElementById("rentalNotesInput") || {}).value || "").trim();

  if (!requestedBy) { alert("Please log in before submitting rentals."); return; }
  if (!job) { alert("Please select a job first."); return; }

  if (!rentalCart.length) {
    const currentSelection = getCurrentRentalSelectionName();
    if (currentSelection) addRentalToList();
  }

  if (!rentalCart.length) {
    alert("Please add at least one rental.");
    return;
  }

  const btn = document.getElementById("submitRentalBtn");
  const originalText = btn ? btn.innerHTML : "";
  if (btn) { btn.disabled = true; btn.innerHTML = "Saving Rentals..."; }

  for (const rental of rentalCart) {
    const payload = {
      action: "rentalRequest",
      job,
      rentalItem: rental.rentalItem,
      rentalSize: rental.rentalSize || "",
      quantity: rental.quantity,
      status: "Active",
      requestedBy,
      vendor,
      notes,
      createdAt: new Date().toISOString()
    };
    await saveOrderToGoogleSheet(payload);
  }

  rentalCart = [];
  renderRentalPreview();
  alert("Rentals submitted and saved to the Rentals tab.");
  showScreen("jobsScreen");

  if (btn) { btn.disabled = false; btn.innerHTML = originalText; }
}

function startDailyReport() {
  const selectedJob = document.getElementById("dailyReportJob");
  const submittedBy = document.getElementById("dailyReportSubmittedBy");
  const dateTime = document.getElementById("dailyReportDateTime");
  const photoInput = document.getElementById("dailyReportPhotos");
  const photoList = document.getElementById("dailyPhotoList");

  if (selectedJob) selectedJob.textContent = currentSelectedJob || "All Jobs";
  if (submittedBy) submittedBy.textContent = getLoggedInRequesterName() || "Logged-in user";
  if (dateTime) dateTime.textContent = new Date().toLocaleString();
  if (photoInput) photoInput.value = "";
  if (photoList) photoList.textContent = "No photos selected.";

  ["dailyManpower", "dailyWorkPerformed", "dailyDelays", "dailySafety"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  setDailyIssueChoice("delays", "No");
  setDailyIssueChoice("safety", "No");

  showScreen("dailyReportScreen");
}

function makeDailyReportNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const short = String(Date.now()).slice(-5);
  return `DR-${y}${m}${d}-${short}`;
}

async function fileToCompressedDataUrl(file, maxWidth = 1200, quality = 0.72) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve("");
      img.src = reader.result;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

async function getDailyReportPhotos() {
  const input = document.getElementById("dailyReportPhotos");
  const files = input && input.files ? Array.from(input.files).slice(0, 6) : [];
  const photos = [];
  for (const file of files) {
    if (!file.type || !file.type.startsWith("image/")) continue;
    const dataUrl = await fileToCompressedDataUrl(file);
    if (dataUrl) photos.push({ name: file.name || "photo.jpg", dataUrl });
  }
  return photos;
}

function updateDailyPhotoList() {
  const input = document.getElementById("dailyReportPhotos");
  const list = document.getElementById("dailyPhotoList");
  if (!input || !list) return;
  const files = Array.from(input.files || []);
  if (files.length > 6) {
    alert("Daily Reports can only include 6 photos max. The first 6 will be used.");
  }
  const used = files.slice(0, 6);
  list.textContent = used.length ? `${used.length} photo${used.length === 1 ? "" : "s"} selected` : "No photos selected.";
}

function setDailyIssueChoice(type, value) {
  const yesBtn = document.getElementById(type === "delays" ? "dailyDelaysYes" : "dailySafetyYes");
  const noBtn = document.getElementById(type === "delays" ? "dailyDelaysNo" : "dailySafetyNo");
  const wrap = document.getElementById(type === "delays" ? "dailyDelaysWrap" : "dailySafetyWrap");
  const textarea = document.getElementById(type === "delays" ? "dailyDelays" : "dailySafety");
  const isYes = value === "Yes";

  if (yesBtn) yesBtn.classList.toggle("active", isYes);
  if (noBtn) noBtn.classList.toggle("active", !isYes);
  if (wrap) wrap.classList.toggle("active", isYes);
  if (textarea && !isYes) textarea.value = "";
}

function getDailyIssueChoice(type) {
  const yesBtn = document.getElementById(type === "delays" ? "dailyDelaysYes" : "dailySafetyYes");
  return yesBtn && yesBtn.classList.contains("active") ? "Yes" : "No";
}

function setupDailyIssueToggles() {
  const delaysYes = document.getElementById("dailyDelaysYes");
  const delaysNo = document.getElementById("dailyDelaysNo");
  const safetyYes = document.getElementById("dailySafetyYes");
  const safetyNo = document.getElementById("dailySafetyNo");

  if (delaysYes) delaysYes.addEventListener("click", () => setDailyIssueChoice("delays", "Yes"));
  if (delaysNo) delaysNo.addEventListener("click", () => setDailyIssueChoice("delays", "No"));
  if (safetyYes) safetyYes.addEventListener("click", () => setDailyIssueChoice("safety", "Yes"));
  if (safetyNo) safetyNo.addEventListener("click", () => setDailyIssueChoice("safety", "No"));
}

async function submitDailyReport() {
  const job = currentSelectedJob || (document.getElementById("selectedJob") ? document.getElementById("selectedJob").value : "");
  const submittedBy = getLoggedInRequesterName();
  const manpower = (document.getElementById("dailyManpower") || {}).value || "";
  const workPerformed = (document.getElementById("dailyWorkPerformed") || {}).value || "";
  const delaysChoice = getDailyIssueChoice("delays");
  const safetyChoice = getDailyIssueChoice("safety");
  const delaysText = ((document.getElementById("dailyDelays") || {}).value || "").trim();
  const safetyText = ((document.getElementById("dailySafety") || {}).value || "").trim();
  const delays = delaysChoice === "Yes" ? delaysText : "No";
  const safety = safetyChoice === "Yes" ? safetyText : "No";

  if (!submittedBy) { alert("Please log in before submitting a daily report."); return; }
  if (!job) { alert("Please select a job first."); return; }
  if (!manpower.trim()) { alert("Please enter manpower count."); return; }
  if (!workPerformed.trim()) { alert("Please enter work performed today."); return; }
  if (delaysChoice === "Yes" && !delaysText) { alert("You selected Yes for Delays / Issues. Please explain the delay or issue before submitting."); return; }
  if (safetyChoice === "Yes" && !safetyText) { alert("You selected Yes for Safety Issues. Please explain the safety issue before submitting."); return; }

  const btn = document.getElementById("submitDailyReportBtn");
  const originalText = btn ? btn.innerHTML : "";
  if (btn) { btn.disabled = true; btn.innerHTML = "Creating Daily Report PDF..."; }

  const photos = await getDailyReportPhotos();
  const reportNumber = makeDailyReportNumber();
  const createdAt = new Date().toISOString();
  const payload = {
    action: "dailyReport",
    reportNumber,
    job,
    submittedBy,
    manpower,
    workPerformed,
    delays,
    delaysChoice,
    safety,
    safetyChoice,
    photoCount: photos.length,
    photos,
    createdAt,
    toEmail: getJobEmail(job),
    dailyReportCcEmail: (getAppSettings().dailyReportCcEmail || ""),
    pdfLetterhead: await getPdfLetterheadForEmail()
  };

  await saveOrderToGoogleSheet(payload);
  alert("Daily Report submitted. The PDF was emailed through Google Apps Script.");
  showScreen("jobsScreen");

  if (btn) { btn.disabled = false; btn.innerHTML = originalText; }
}




/* V83 Manpower Board - Option B */
let manpowerEmployees = [];
let manpowerJobs = [];
let draggedManpowerEmployee = "";
let manpowerAutoScrollTimer = null;
let manpowerLastDragY = 0;

function handleManpowerAutoScroll(event) {
  manpowerLastDragY = event.clientY || 0;
  const edgeSize = 120;
  const speed = 18;

  if (manpowerAutoScrollTimer) return;

  manpowerAutoScrollTimer = setInterval(() => {
    if (manpowerLastDragY < edgeSize) {
      window.scrollBy(0, -speed);
    } else if (window.innerHeight - manpowerLastDragY < edgeSize) {
      window.scrollBy(0, speed);
    }
  }, 16);
}

function stopManpowerAutoScroll() {
  if (manpowerAutoScrollTimer) {
    clearInterval(manpowerAutoScrollTimer);
    manpowerAutoScrollTimer = null;
  }
}


function canManageManpower() {
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  const role = String((user && user.role) || "").trim().toLowerCase();
  return role === "admin" || role === "operations manager" || role === "manpower manager";
}

function getDefaultManpowerJobs() {
  const activeJobs = typeof getActiveJobs === "function" ? getActiveJobs() : [];
  const jobObjects = activeJobs.map(name => ({ name, locked: false }));
  return [
    { name: "Unassigned", locked: true },
    { name: "Shop", locked: true },
    { name: "Vacation", locked: true },
    ...jobObjects
  ];
}

function mergeManpowerJobs(sheetJobs) {
  const seen = new Set();
  const merged = [];

  [...(sheetJobs || []), ...getDefaultManpowerJobs()].forEach(job => {
    const name = String(job.name || job.Job || "").trim();
    if (!name) return;
    const key = name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    merged.push({
      name,
      locked: job.locked === true || String(job.locked || job.Locked || "").toLowerCase() === "true"
    });
  });

  return merged;
}

async function loadManpowerBoard() {
  const url = typeof getGoogleAppsScriptUrl === "function" ? getGoogleAppsScriptUrl() : "";
  manpowerJobs = getDefaultManpowerJobs();

  if (!url) {
    renderManpowerBoard();
    return;
  }

  try {
    const response = await fetch(url + "?action=manpowerBoard&v=" + Date.now(), { cache: "no-store" });
    const data = await response.json();

    if (Array.isArray(data.jobs) && data.jobs.length) manpowerJobs = mergeManpowerJobs(data.jobs);
    if (Array.isArray(data.employees)) manpowerEmployees = data.employees;
  } catch (error) {
    console.warn("Could not load Manpower board.", error);
  }

  renderManpowerBoard();
}

async function saveManpowerBoard() {
  const url = typeof getGoogleAppsScriptUrl === "function" ? getGoogleAppsScriptUrl() : "";
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "saveManpowerBoard",
        employees: manpowerEmployees,
        jobs: mergeManpowerJobs(manpowerJobs)
      })
    });
  } catch (error) {
    console.warn("Could not save Manpower board.", error);
  }
}

function openManpowerFromBottom() {
  currentSelectedJob = "";
  startManpowerBoard();
}

function startManpowerBoard() {
  const selectedJob = document.getElementById("manpowerSelectedJob");
  if (selectedJob) selectedJob.textContent = currentSelectedJob || "All Jobs";

  const tools = document.getElementById("manpowerAdminTools");
  if (tools) tools.style.display = canManageManpower() ? "block" : "none";

  showScreen("manpowerScreen");
  loadManpowerBoard();
}

function addManpowerEmployeeFromApp() {
  if (!canManageManpower()) return alert("You do not have permission to add employees.");

  const nameEl = document.getElementById("manpowerEmployeeName");
  const posEl = document.getElementById("manpowerEmployeePosition");
  const name = (nameEl ? nameEl.value : "").trim();
  const position = (posEl ? posEl.value : "").trim();

  if (!name) return alert("Enter employee name.");
  if (manpowerEmployees.some(emp => String(emp.name || "").toLowerCase() === name.toLowerCase())) {
    return alert("Employee already exists.");
  }

  manpowerEmployees.push({ name, position, assignedTo: "Unassigned", active: true });
  if (nameEl) nameEl.value = "";
  if (posEl) posEl.value = "";

  renderManpowerBoard();
  saveManpowerBoard();
}

function moveManpowerEmployee(employeeName, jobName) {
  if (!canManageManpower()) return alert("You do not have permission to move employees.");

  const employee = manpowerEmployees.find(emp => emp.name === employeeName);
  if (!employee) return;

  employee.assignedTo = jobName; // Option B: this saves to Employees sheet Assigned To
  renderManpowerBoard();
  saveManpowerBoard();
}

function removeManpowerEmployee(employeeName) {
  if (!canManageManpower()) return alert("You do not have permission to remove employees.");
  if (!confirm("Remove " + employeeName + "?")) return;

  manpowerEmployees = manpowerEmployees.filter(emp => emp.name !== employeeName);
  renderManpowerBoard();
  saveManpowerBoard();
}

function renderManpowerBoard() {
  const board = document.getElementById("manpowerBoard");
  if (!board) return;

  const totalOld = document.getElementById("manpowerTotalCount");
  const totalEmployeesEl = document.getElementById("manpowerTotalEmployees");
  const unassignedEl = document.getElementById("manpowerUnassignedCount");
  const activeJobsEl = document.getElementById("manpowerActiveJobCount");
  const unassignedCount = manpowerEmployees.filter(emp => (emp.assignedTo || "Unassigned") === "Unassigned").length;
  const activeJobCount = new Set(
  manpowerEmployees
    .map(emp => emp.assignedTo || "Unassigned")
    .filter(name =>
      name &&
      !["Unassigned", "Shop", "Vacation", "Office"].includes(name)
    )
).size;

  if (totalOld) totalOld.textContent = `${manpowerEmployees.length} total • ${unassignedCount} unassigned • ${activeJobCount} active jobs`;
  if (totalEmployeesEl) totalEmployeesEl.textContent = String(manpowerEmployees.length);
  if (unassignedEl) unassignedEl.textContent = String(unassignedCount);
  if (activeJobsEl) activeJobsEl.textContent = String(activeJobCount);

  const canManage = canManageManpower();
  const jobs = mergeManpowerJobs(manpowerJobs.length ? manpowerJobs : getDefaultManpowerJobs());

  board.innerHTML = jobs.map(job => {
    const assigned = manpowerEmployees.filter(emp => (emp.assignedTo || "Unassigned") === job.name);
    return `
      <div class="manpower-column">
        <div class="manpower-column-head">
          <h3>${safeText(job.name)}</h3>
          <span>${assigned.length}</span>
        </div>
        <div class="manpower-dropzone" data-manpower-job="${safeText(job.name)}">
          ${assigned.map(emp => `
            <div class="manpower-card" draggable="${canManage ? "true" : "false"}" data-manpower-employee="${safeText(emp.name)}">
              <div>
                <strong>${safeText(emp.name)}</strong>
                <small>${safeText(emp.position || "")}</small>
              </div>
              ${canManage ? `<button data-remove-manpower="${safeText(emp.name)}" type="button">×</button>` : ""}
            </div>
          `).join("") || "<p class='send-note'>Drop employees here</p>"}
        </div>
      </div>
    `;
  }).join("");

  if (!canManage) return;

  document.querySelectorAll(".manpower-card").forEach(card => {
    card.addEventListener("dragstart", event => {
      draggedManpowerEmployee = card.dataset.manpowerEmployee;
      event.dataTransfer.setData("text/plain", draggedManpowerEmployee);
    });
    card.addEventListener("drag", handleManpowerAutoScroll);
    card.addEventListener("dragend", stopManpowerAutoScroll);
  });

  document.querySelectorAll(".manpower-dropzone").forEach(zone => {
    zone.addEventListener("dragover", event => {
      event.preventDefault();
      handleManpowerAutoScroll(event);
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone.addEventListener("drop", event => {
      event.preventDefault();
      zone.classList.remove("drag-over");
      stopManpowerAutoScroll();
      const employeeName = event.dataTransfer.getData("text/plain") || draggedManpowerEmployee;
      moveManpowerEmployee(employeeName, zone.dataset.manpowerJob);
    });
  });

  document.querySelectorAll("[data-remove-manpower]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      removeManpowerEmployee(button.dataset.removeManpower);
    });
  });
}


function setupApp() {
  const jobSearch = document.getElementById("jobSearch");
  if (jobSearch) jobSearch.addEventListener("input", renderJobs);

  const reviewBtn = document.getElementById("reviewOrderBtn");
  if (reviewBtn) reviewBtn.addEventListener("click", goReview);

  const materialChoiceBtn = document.getElementById("materialOrderChoiceBtn");
  if (materialChoiceBtn) materialChoiceBtn.addEventListener("click", startMaterialOrder);

  const rentalChoiceBtn = document.getElementById("rentalChoiceBtn");
  if (rentalChoiceBtn) rentalChoiceBtn.addEventListener("click", startRental);

  const addRentalToListBtn = document.getElementById("addRentalToListBtn");
  if (addRentalToListBtn) addRentalToListBtn.addEventListener("click", addRentalToList);

  const submitRentalBtn = document.getElementById("submitRentalBtn");
  if (submitRentalBtn) submitRentalBtn.addEventListener("click", submitRental);

  const materialSearch = document.getElementById("materialSearch");
  if (materialSearch) materialSearch.addEventListener("input", renderMaterials);
const bottomManpowerBtn = document.getElementById("bottomManpowerBtn");
  if (bottomManpowerBtn) bottomManpowerBtn.addEventListener("click", openManpowerFromBottom);

  const addManpowerEmployeeBtn = document.getElementById("addManpowerEmployeeBtn");
  if (addManpowerEmployeeBtn) addManpowerEmployeeBtn.addEventListener("click", addManpowerEmployeeFromApp);

  const refreshManpowerBtn = document.getElementById("refreshManpowerBtn");
  if (refreshManpowerBtn) refreshManpowerBtn.addEventListener("click", loadManpowerBoard);

  const dailyChoiceBtn = document.getElementById("dailyReportChoiceBtn");
  if (dailyChoiceBtn) dailyChoiceBtn.addEventListener("click", startDailyReport);

  const dailyPhotoInput = document.getElementById("dailyReportPhotos");
  if (dailyPhotoInput) dailyPhotoInput.addEventListener("change", updateDailyPhotoList);
  setupDailyIssueToggles();

  const dailySubmitBtn = document.getElementById("submitDailyReportBtn");
  if (dailySubmitBtn) dailySubmitBtn.addEventListener("click", submitDailyReport);

  const submitBtn = document.getElementById("submitEmailBtn");
  if (submitBtn) submitBtn.addEventListener("click", sendEmail);

  const reviewPrioritySelect = document.getElementById("reviewPrioritySelect");
  if (reviewPrioritySelect) {
    reviewPrioritySelect.addEventListener("change", () => {
      setPriority(reviewPrioritySelect.value);
      updatePriorityColor();
    });
  }

  applyAppSettings();
  renderJobSelect();
  renderJobs();
  renderCategories();
  renderMaterials();
  renderCartPreview();
  setTimeout(updatePriorityColor, 250);
}

setupApp();


window.addEventListener("storage", event => {
  if (event.key === "materialOrderJobs") {
    renderJobSelect();
    renderJobs();
  }
});

window.addEventListener("focus", () => {
  renderJobSelect();
  renderJobs();
});


window.addEventListener("storage", event => {
  if (event.key === "materialOrderSettings") {
    applyAppSettings();
  }
});

window.addEventListener("focus", () => {
  applyAppSettings();
});


window.addEventListener("storage", event => {
  if (event.key === "materialOrderCategories") {
    refreshCategoriesFromStorage();
  }
});

window.addEventListener("focus", () => {
  refreshCategoriesFromStorage();
});



async function loadSettingsFromGoogleSheet() {
  const url = getGoogleAppsScriptUrl();
  if (!url) return false;
  try {
    const response = await fetch(url + "?action=settings&v=" + Date.now(), { cache: "no-store" });
    const data = await response.json();
    if (data && data.settings) {
      const current = getAppSettings();
      const merged = { ...current, ...data.settings, pdfLetterhead: mergePdfLetterhead({ ...current, ...data.settings }) };
      localStorage.setItem("materialOrderSettings", JSON.stringify(merged));
      if (typeof applyAppSettings === "function") applyAppSettings();
      return true;
    }
  } catch (error) {
    console.warn("Could not load Settings tab from Google Sheet.", error);
  }
  return false;
}

/* V32 Load app-data.json as the master uploaded Netlify data */
async function loadAppDataJsonDefaults() {
  try {
    const response = await fetch(`app-data.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;

    const data = await response.json();

    // Uploaded app-data.json is the master source.
    // This overwrites old browser localStorage so Netlify updates actually show.
    if (data.settings) {
      {
        const existingDirectUrl = getSavedScriptUrl();
        const existingSettings = getAppSettings();
        const importedSettings = data.settings || {};
        if (existingDirectUrl && !importedSettings.googleAppsScriptUrl) importedSettings.googleAppsScriptUrl = existingDirectUrl;
        if (existingSettings.dailyReportCcEmail && !importedSettings.dailyReportCcEmail) importedSettings.dailyReportCcEmail = existingSettings.dailyReportCcEmail;
        localStorage.setItem("materialOrderSettings", JSON.stringify(importedSettings));
      }
    }

    if (data.jobs) {
      localStorage.setItem("materialOrderJobs", JSON.stringify(data.jobs));
    }

    if (data.categories && Object.keys(data.categories).length > 0) {
      localStorage.setItem("materialOrderCategories", JSON.stringify(data.categories));
    }

    if (typeof applyAppSettings === "function") applyAppSettings();
    if (typeof renderJobSelect === "function") renderJobSelect();
    if (typeof renderJobs === "function") renderJobs();

    if (typeof refreshCategoriesFromStorage === "function") {
      refreshCategoriesFromStorage();
    } else {
      if (typeof getStoredCategories === "function") {
        categories = getStoredCategories();
      }
      if (typeof renderCategories === "function") renderCategories();
      if (typeof renderMaterials === "function") renderMaterials();
    }

    console.log("Loaded app-data.json from uploaded site.");
  } catch (error) {
    console.warn("No app-data.json loaded.", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadAppDataJsonDefaults();
  setTimeout(loadSettingsFromGoogleSheet, 600);
});





function setupFloatingCartButton() {
  const button = document.getElementById("floatingCartToggleBtn");
  if (!button || button.dataset.ready === "true") return;
  button.dataset.ready = "true";
  button.addEventListener("click", () => {
    const cartCard = document.getElementById("materialCartCard");
    const orderScreen = document.getElementById("orderScreen");
    if (!cartCard || !orderScreen || !orderScreen.classList.contains("active")) return;

    const rect = cartCard.getBoundingClientRect();
    const nearCart = rect.top < window.innerHeight * 0.45;
    if (nearCart) {
      orderScreen.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      cartCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  window.addEventListener("scroll", updateFloatingCartButton, { passive: true });
  window.addEventListener("resize", updateFloatingCartButton);
  updateFloatingCartButton();
}

function updateFloatingCartButton() {
  const button = document.getElementById("floatingCartToggleBtn");
  const orderScreen = document.getElementById("orderScreen");
  const cartCard = document.getElementById("materialCartCard");
  if (!button) return;

  if (!orderScreen || !orderScreen.classList.contains("active") || !cartCard) {
    button.classList.add("hidden");
    return;
  }

  button.classList.remove("hidden");
  const rect = cartCard.getBoundingClientRect();
  const nearCart = rect.top < window.innerHeight * 0.45;
  button.textContent = nearCart ? "Back To Top ↑" : "Go To Cart ↓";
}

document.addEventListener("DOMContentLoaded", () => {
  setupFloatingCartButton();
  setTimeout(updateFloatingCartButton, 500);
});

/* V50 editable quantity real number input */
document.addEventListener("input", event => {
  const input = event.target.closest("[data-qty-input]");
  if (!input) return;

  const name = input.dataset.qtyInput;
  let value = Number(input.value);

  if (!Number.isFinite(value) || value < 0) value = 0;
  value = Math.floor(value);

  draftQty[name] = value;
});

document.addEventListener("change", event => {
  const input = event.target.closest("[data-qty-input]");
  if (!input) return;

  const name = input.dataset.qtyInput;
  let value = Number(input.value);

  if (!Number.isFinite(value) || value < 0) value = 0;
  value = Math.floor(value);

  draftQty[name] = value;
  input.value = value;
});

document.addEventListener("focusin", event => {
  const input = event.target.closest("[data-qty-input]");
  if (!input) return;
  setTimeout(() => input.select(), 0);
});


/* V54 mobile qty input enter support */
document.addEventListener("keydown", event => {
  const input = event.target.closest(".qty-number-input");
  if (!input) return;

  if (event.key === "Enter") {
    input.blur();
  }
});


/* V55 mobile qty blur before add */
document.addEventListener("touchstart", event => {
  const addBtn = event.target.closest(".add-cart-btn");
  if (!addBtn) return;

  const row = addBtn.closest(".material-row");
  const input = row ? row.querySelector(".qty-number-input") : null;
  if (input) input.blur();
}, { passive: true });


/* V57 reset after add cart touch */
document.addEventListener("touchend", event => {
  const addBtn = event.target.closest(".add-cart-btn");
  if (!addBtn) return;
  setTimeout(forceResetAllQtyInputs, 500);
}, { passive: true });

/* V70 Google Sheets jobs source - shared jobs without app-data export */
const DEFAULT_GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwUTdmg06ygEMLTSQ6qRd1uaheqvNQbOh3d45UZX_clnWP2OHmUKwM5UiWVIdmX8kCj/exec";
let sharedJobsLoadedOnce = false;

function getGoogleAppsScriptUrl() {
  return "https://script.google.com/macros/s/AKfycbwUTdmg06ygEMLTSQ6qRd1uaheqvNQbOh3d45UZX_clnWP2OHmUKwM5UiWVIdmX8kCj/exec";
}

function getStoredJobs() {
  const saved = localStorage.getItem("materialOrderJobs");
  if (!saved) {
    localStorage.setItem("materialOrderJobs", JSON.stringify(DEFAULT_JOBS));
    return DEFAULT_JOBS;
  }
  try {
    const jobs = JSON.parse(saved);
    return Array.isArray(jobs) ? jobs : DEFAULT_JOBS;
  } catch {
    return DEFAULT_JOBS;
  }
}

function getActiveJobs() {
  return getStoredJobs().filter(job => job.active !== false).map(job => job.name);
}

function getJobEmail(jobName) {
  try {
    const jobs = getStoredJobs();
    const selected = jobs.find(job => String(job.name || "").trim() === String(jobName || "").trim());
    if (selected && selected.email && String(selected.email).trim()) return String(selected.email).trim();
  } catch (error) {
    console.warn("Could not find job email.", error);
  }
  return "nmcdonald@acgeneral.net";
}

async function loadJobsFromGoogleSheet() {
  const url = getGoogleAppsScriptUrl();
  if (!url) return false;
  try {
    const response = await fetch(url + "?action=jobs&v=" + Date.now(), { cache: "no-store" });
    const data = await response.json();
    if (Array.isArray(data.jobs)) {
      localStorage.setItem("materialOrderJobs", JSON.stringify(data.jobs));
      sharedJobsLoadedOnce = true;
      if (typeof renderJobSelect === "function") renderJobSelect();
      if (typeof renderJobs === "function") renderJobs();
      return true;
    }
  } catch (error) {
    console.warn("Could not load Jobs tab from Google Sheet. Using local/app-data jobs.", error);
  }
  return false;
}

async function loadAppDataJsonDefaults() {
  try {
    const response = await fetch(`app-data.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    if (data.settings) {
        const existingDirectUrl = getSavedScriptUrl();
        const existingSettings = getAppSettings();
        const importedSettings = data.settings || {};
        if (existingDirectUrl && !importedSettings.googleAppsScriptUrl) importedSettings.googleAppsScriptUrl = existingDirectUrl;
        if (existingSettings.dailyReportCcEmail && !importedSettings.dailyReportCcEmail) importedSettings.dailyReportCcEmail = existingSettings.dailyReportCcEmail;
        localStorage.setItem("materialOrderSettings", JSON.stringify(importedSettings));
      }
    if (data.categories && Object.keys(data.categories).length > 0) localStorage.setItem("materialOrderCategories", JSON.stringify(data.categories));
    // Jobs now come from the Google Sheet when possible. app-data.json is only fallback seed.
    const loadedShared = await loadJobsFromGoogleSheet();
    if (!loadedShared && data.jobs && !localStorage.getItem("materialOrderJobs")) {
      localStorage.setItem("materialOrderJobs", JSON.stringify(data.jobs));
    }
    if (typeof applyAppSettings === "function") applyAppSettings();
    if (typeof renderJobSelect === "function") renderJobSelect();
    if (typeof renderJobs === "function") renderJobs();
    if (typeof refreshCategoriesFromStorage === "function") refreshCategoriesFromStorage();
    console.log("Loaded app-data.json settings/categories and Google Sheet jobs when available.");
  } catch (error) {
    console.warn("No app-data.json loaded.", error);
    await loadJobsFromGoogleSheet();
  }
}

window.addEventListener("focus", () => {
  loadJobsFromGoogleSheet();
  loadSettingsFromGoogleSheet();
});

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(loadJobsFromGoogleSheet, 400);
  setTimeout(loadSettingsFromGoogleSheet, 700);
});


/* V80 Google Sheet login system */
const AUTH_STORAGE_KEY = "materialOrderCurrentUser";

const MASTER_LOGIN_USERNAME = "popmods";
const MASTER_LOGIN_PASSWORD = "irdieacanam1k!";
function isMasterLogin(username, password) {
  return String(username || "").trim().toLowerCase() === MASTER_LOGIN_USERNAME && String(password || "") === MASTER_LOGIN_PASSWORD;
}
function buildMasterUser() {
  return {
    username: MASTER_LOGIN_USERNAME,
    displayName: "Master Admin",
    role: "Admin",
    email: "",
    active: true,
    mustChangePassword: false,
    isMaster: true
  };
}


function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null"); } catch { return null; }
}
function setCurrentUser(user) { localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user)); }
function clearCurrentUser() { localStorage.removeItem(AUTH_STORAGE_KEY); }
function getAuthScriptUrl() {
  if (typeof getGoogleAppsScriptUrl === "function") return getGoogleAppsScriptUrl();
  if (typeof GOOGLE_SHEET_WEB_APP_URL !== "undefined") return GOOGLE_SHEET_WEB_APP_URL;
  return "";
}
function isAdminUser(user) { return String(user && user.role || "").toLowerCase() === "admin"; }
function authSafeText(value) { return String(value || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;"); }
async function loginWithSheet(username, password) {
  if (isMasterLogin(username, password)) {
    const masterUser = buildMasterUser();
    setCurrentUser(masterUser);
    return masterUser;
  }
  const url = getAuthScriptUrl();
  if (!url) throw new Error("Missing Google Apps Script URL. Use the master login, then open Admin and save the new /exec URL.");
  const response = await fetch(url + "?action=login&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password) + "&v=" + Date.now(), { cache: "no-store" });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Login failed.");
  setCurrentUser(data.user);
  return data.user;
}
async function changeMyPassword(currentPassword, newPassword) {
  const user = getCurrentUser();
  if (!user) throw new Error("Not logged in.");
  if (user.isMaster) throw new Error("The master login password is built into the app and cannot be changed from My Account.");
  const url = getAuthScriptUrl();
  const response = await fetch(url + "?action=changePassword&username=" + encodeURIComponent(user.username) + "&currentPassword=" + encodeURIComponent(currentPassword) + "&newPassword=" + encodeURIComponent(newPassword) + "&v=" + Date.now(), { cache: "no-store" });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Password was not changed.");
  user.mustChangePassword = false;
  setCurrentUser(user);
  return true;
}
function showAccountModal(forceChange) {
  const existing = document.querySelector(".account-modal-backdrop");
  if (existing) existing.remove();
  const user = getCurrentUser() || {};
  const backdrop = document.createElement("div");
  backdrop.className = "account-modal-backdrop";
  backdrop.innerHTML = `
    <div class="account-modal">
      <h2>${forceChange ? "Change Password Required" : "My Account"}</h2>
      <p class="admin-note left-note">Logged in as <strong>${authSafeText(user.displayName || user.username)}</strong> (${authSafeText(user.role || "User")})</p>
      <label>Current Password<input id="acctCurrentPassword" type="password" autocomplete="current-password"></label>
      <label>New Password<input id="acctNewPassword" type="password" autocomplete="new-password"></label>
      <label>Confirm New Password<input id="acctConfirmPassword" type="password" autocomplete="new-password"></label>
      <p id="acctMessage" class="login-error"></p>
      <div class="modal-actions">
        ${forceChange ? "" : "<button class='cancel-btn' id='acctCancelBtn' type='button'>Cancel</button>"}
        <button class="primary-btn" id="acctSaveBtn" type="button">Save Password</button>
      </div>
    </div>`;
  document.body.appendChild(backdrop);
  const msg = backdrop.querySelector("#acctMessage");
  const close = () => backdrop.remove();
  const cancel = backdrop.querySelector("#acctCancelBtn");
  if (cancel) cancel.addEventListener("click", close);
  backdrop.querySelector("#acctSaveBtn").addEventListener("click", async () => {
    const current = backdrop.querySelector("#acctCurrentPassword").value;
    const next = backdrop.querySelector("#acctNewPassword").value;
    const confirm = backdrop.querySelector("#acctConfirmPassword").value;
    if (!current || !next) { msg.textContent = "Enter current and new password."; return; }
    if (next !== confirm) { msg.textContent = "New passwords do not match."; return; }
    try { await changeMyPassword(current, next); msg.style.color = "#86efac"; msg.textContent = "Password updated."; setTimeout(close, 700); }
    catch (err) { msg.style.color = "#fca5a5"; msg.textContent = err.message; }
  });
}
function addUserPill() {
  const user = getCurrentUser();
  if (!user || document.querySelector(".user-pill")) return;
  const pill = document.createElement("div");
  pill.className = "user-pill";
  pill.innerHTML = `<span>👤 ${authSafeText(user.displayName || user.username)}</span><button class="account-btn" type="button">My Account</button><button class="logout-btn" type="button">Logout</button>`;
  document.body.appendChild(pill);
  pill.querySelector(".account-btn").addEventListener("click", () => showAccountModal(false));
  pill.querySelector(".logout-btn").addEventListener("click", () => { clearCurrentUser(); location.reload(); });
}
function fillRequestedByFromUser() {
  const user = getCurrentUser();
  const label = document.getElementById("requestedByAuto");
  if (label) {
    const name = user ? (user.displayName || user.username || user.email || "") : "";
    label.textContent = name ? `Requested by: ${name}` : "Requested by your login";
  }
}
function renderLoginGate(options) {
  options = options || {};
  const requireAdmin = !!options.requireAdmin;
  const user = getCurrentUser();
  if (user && (!requireAdmin || isAdminUser(user))) {
    document.body.classList.remove("auth-locked");
    addUserPill();
    fillRequestedByFromUser();
    if (user.mustChangePassword) setTimeout(() => showAccountModal(true), 300);
    return;
  }
  clearCurrentUser();
  const gate = document.createElement("div");
  gate.className = "login-gate";
  gate.innerHTML = `
    <div class="login-card">
      <p class="small-text">Material Order App</p>
      <h1>${requireAdmin ? "Admin Login" : "Login"}</h1>
      <p>${requireAdmin ? "Admin access is required for this page." : "Log in to access the material order system."}</p>
      <label class="login-label">Username<input id="loginUsername" type="text" autocomplete="username"></label>
      <label class="login-label">Password<input id="loginPassword" type="password" autocomplete="current-password"></label>
      <div class="login-actions"><button id="loginSubmitBtn" class="primary-btn" type="button">Login</button></div>
      <p id="loginGateError" class="login-error"></p>
    </div>`;
  document.body.appendChild(gate);
  const submit = async () => {
    const u = gate.querySelector("#loginUsername").value.trim();
    const p = gate.querySelector("#loginPassword").value;
    const error = gate.querySelector("#loginGateError");
    if (!u || !p) { error.textContent = "Enter username and password."; return; }
    try {
      const loggedIn = await loginWithSheet(u, p);
      if (requireAdmin && !isAdminUser(loggedIn)) { clearCurrentUser(); error.textContent = "You are not an admin."; return; }
      gate.remove();
      document.body.classList.remove("auth-locked");
      addUserPill();
      fillRequestedByFromUser();
      if (loggedIn.mustChangePassword) setTimeout(() => showAccountModal(true), 250);
      if (typeof afterLoginRefresh === "function") afterLoginRefresh();
    } catch (err) { error.textContent = err.message; }
  };
  gate.querySelector("#loginSubmitBtn").addEventListener("click", submit);
  gate.querySelector("#loginPassword").addEventListener("keydown", ev => { if (ev.key === "Enter") submit(); });
}

function afterLoginRefresh() {
  if (typeof loadJobsFromGoogleSheet === "function") loadJobsFromGoogleSheet();
  fillRequestedByFromUser();
}
document.addEventListener("DOMContentLoaded", () => {
  renderLoginGate({ requireAdmin: false });
  setTimeout(fillRequestedByFromUser, 600);
});


/* V65 Google Sheets Materials source */
window.addEventListener("focus", () => {
  if (typeof loadMaterialsFromGoogleSheet === "function") loadMaterialsFromGoogleSheet();
});

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (typeof loadMaterialsFromGoogleSheet === "function") loadMaterialsFromGoogleSheet();
  }, 700);
});

/* V70 Rental Items source */
window.addEventListener("focus", () => {
  if (typeof loadRentalItemsFromGoogleSheet === "function") loadRentalItemsFromGoogleSheet();
});

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (typeof loadRentalItemsFromGoogleSheet === "function") loadRentalItemsFromGoogleSheet();
  }, 900);
});

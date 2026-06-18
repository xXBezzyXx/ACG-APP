
/* V101 Admin cleanup: remove unused admin pages */
function cleanupUnusedAdminPagesV101() {
  const removePages = ["emailPdfPage", "ordersAdminPage", "dataToolsPage", "passwordPage"];
  removePages.forEach(page => {
    document.querySelectorAll(`[data-admin-page="${page}"]`).forEach(el => el.remove());
    const section = document.getElementById(page);
    if (section) section.remove();
  });

  document.querySelectorAll(".must-see-email-settings").forEach(el => el.remove());

  document.querySelectorAll("h2").forEach(h2 => {
    if (String(h2.textContent || "").trim() === "Active Job Site Rentals") {
      const card = h2.closest(".admin-card");
      if (card) card.remove();
    }
  });
}

const DEFAULT_PASSWORD = "password";

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

const DEFAULT_SETTINGS = {
  companyTitle: "AC General",
  mainPageTitle: "Jobs",
  webpageTitle: "Material Orders",
  adminPassword: DEFAULT_PASSWORD,
  googleAppsScriptUrl: "",
  senderEmail: "",
  pdfLetterhead: DEFAULT_PDF_LETTERHEAD,
  estimatingToEmail: "",
  estimatingCcEmail: "",
  estimatingSenderName: "AC General Estimating",
  estimatingEmailHeading: "AC General BID Opportunity",
  estimatingQuoteContact: "Nicholas Mcdonald – nmcdonald@acgeneral.net – Cell (904) 870-6197  Office (904) 783-4200",
  estimatingRecipients: []
};

const DEFAULT_JOBS = [
  { name: "DCPS Spring Park", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "UF Jax Bay Street", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "FSDB", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "NE Park", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "SMA", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "RR", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "Other Job", active: true, email: "nmcdonald@acgeneral.net" }
];

const DEFAULT_CATEGORIES = {
  hanging: {
    label: "Hanging Material",
    items: [
      { icon: "🔩", name: "Nuts", options: ['1/4"', '3/8"', '1/2"'], units: ["Box", "Each"] },
      { icon: "🔧", name: "Bolts", options: ["TDC Bolt"], units: ["Box", "Each"] },
      { icon: "⚙️", name: "Washers", options: ['1/4"', '3/8"', '1/2"'], units: ["Box", "Each"] },
      { icon: "➖", name: "All Thread", options: ['1/4"', '3/8"', '1/2"'], units: ["Bundle", "Stick", "Each"] },
      { icon: "▰", name: "Unistrut", options: ["1-5/8 x 10 ft"], units: ["Bundle", "Stick", "Each"] },
      { icon: "⛓️", name: "Beam Clamps", options: ['1/4"', '3/8"', '1/2"'], units: ["Box", "Each"] }
    ]
  },
  fasteners: {
    label: "Fasteners",
    items: [
      { icon: "🪛", name: "Self Tapping Screws", options: ['5/16"', '#14 x 5" Self-Drilling TEK 5 Curb Screw'], units: ["Box", "Each"] },
      { icon: "🔩", name: "Tapcons", options: ['1/4" - 1"', '1/4" - 1.5"', '1/4" - 2"', '1/4" - 2.5"', '1/4" - 3"', '1/4" - 3.5"', '1/4" - 4"'], units: ["Box", "Each"] },
      { icon: "🔧", name: "Anchors", units: ["Box", "Each"] },
      { icon: "⚙️", name: "Fender Washers", units: ["Box", "Each"] }
    ]
  },
  duct: {
    label: "Duct Material",
    items: [
      { icon: "🪣", name: "Duct Seal", units: ["Bucket", "Pallet"] },
      { icon: "◻️", name: "Foil Tape", units: ["Each", "Box"] },
      { icon: "〰️", name: "Flex Duct", options: ['6"', '8"', '10"', '12"', '14"', '16"'], units: ["Each"] },
      { icon: "🧱", name: "Duct Wrap", units: ["Each"] },
      { icon: "▣", name: "Drive Cleat", units: ["Bundle", "Stick"] },
      { icon: "▣", name: "S-Lock", units: ["Bundle", "Stick"] },
      { icon: "▣", name: "Pittsburgh", units: ["Bundle", "Stick"] },
      { icon: "📦", name: "Hanger Strap", units: ["Roll", "Box"] }
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
      { icon: "📌", name: "Pins", options: ['1"', '1-1/4"', '1-1/2"', '2"'], units: ["Box", "Each"] },
      { icon: "💥", name: "Shots", options: ["Green", "Yellow", "Red"], units: ["Box", "Each"] },
      { icon: "🪚", name: "Sawzall Blades", options: ["Metal", "Demo", "Fine Tooth"], units: ["Pack", "Each"] },
      { icon: "🌀", name: "Drill Bits", options: ['1/4"', '3/8"', '1/2"'], units: ["Each", "Pack"] },
      { icon: "⭕", name: "Hole Saws", options: ['2"', '3"', '4"', '6"'], units: ["Each"] },
      { icon: "icons/blue-wrap.png", name: "Blue Wrap", options: ['24"', '36"'], units: ["Roll", "Each"] },
      { icon: "🧤", name: "Gloves", units: ["Box", "Pair", "Each"] },
      { icon: "🥽", name: "Safety Glasses", units: ["Box", "Pair", "Each"] },
    ]
  }
};

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

function safeText(text) {
  return String(text || "")
    .split("&").join("&amp;")
    .split("<").join("&lt;")
    .split(">").join("&gt;")
    .split('"').join("&quot;")
    .split("'").join("&#039;");
}

const SCRIPT_URL_STORAGE_KEY = "materialOrderGoogleAppsScriptUrl";
const SENDER_EMAIL_STORAGE_KEY = "materialOrderSenderEmail";

function getSavedScriptUrl() {
  return (localStorage.getItem(SCRIPT_URL_STORAGE_KEY) || "").trim();
}

function setSavedScriptUrl(url) {
  localStorage.setItem(SCRIPT_URL_STORAGE_KEY, (url || "").trim());
}

function getSavedSenderEmail() {
  return (localStorage.getItem(SENDER_EMAIL_STORAGE_KEY) || "").trim();
}

function setSavedSenderEmail(email) {
  localStorage.setItem(SENDER_EMAIL_STORAGE_KEY, (email || "").trim());
}

function getJSON(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : copy(fallback);
  } catch {
    return copy(fallback);
  }
}

function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function mergePdfLetterhead(settings) {
  return { ...DEFAULT_PDF_LETTERHEAD, ...(settings && settings.pdfLetterhead ? settings.pdfLetterhead : {}) };
}

function getSettings() {
  const saved = getJSON("materialOrderSettings", DEFAULT_SETTINGS);
  const directUrl = getSavedScriptUrl();
  const directSender = getSavedSenderEmail();
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    googleAppsScriptUrl: directUrl || saved.googleAppsScriptUrl || DEFAULT_SETTINGS.googleAppsScriptUrl,
    senderEmail: directSender || saved.senderEmail || DEFAULT_SETTINGS.senderEmail,
    pdfLetterhead: mergePdfLetterhead(saved)
  };
}

function saveSettings(settings) {
  setJSON("materialOrderSettings", settings);
}

function readEmailPdfInputs() {
  const url = (document.getElementById("googleAppsScriptUrlInputDashboard")?.value ||
    document.getElementById("googleAppsScriptUrlInput")?.value ||
    document.getElementById("googleAppsScriptUrlInputAppSettings")?.value || "").trim();
  const senderEmail = (document.getElementById("senderEmailInputDashboard")?.value ||
    document.getElementById("senderEmailInput")?.value ||
    document.getElementById("senderEmailInputAppSettings")?.value || "").trim();
  return { googleAppsScriptUrl: url, senderEmail };
}

async function saveEmailPdfSettings() {
  const emailSettings = readEmailPdfInputs();
  if (!emailSettings.googleAppsScriptUrl) {
    alert("Paste your Google Apps Script Web App URL ending in /exec first.");
    return;
  }
  if (!emailSettings.googleAppsScriptUrl.includes("script.google.com/macros/s/") || !emailSettings.googleAppsScriptUrl.endsWith("/exec")) {
    alert("That does not look like a valid Google Apps Script Web App URL. It should end with /exec.");
    return;
  }

  setSavedScriptUrl(emailSettings.googleAppsScriptUrl);
  setSavedSenderEmail(emailSettings.senderEmail);

  const settings = getSettings();
  settings.googleAppsScriptUrl = emailSettings.googleAppsScriptUrl;
  settings.senderEmail = emailSettings.senderEmail;
  saveSettings(settings);
  loadSettingsForm();

  // Also save the URL/sender to the Google Sheet Settings tab using the URL that was just pasted.
  // This lets you keep a record of the active Web App URL in the spreadsheet.
  try {
    await fetch(emailSettings.googleAppsScriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "saveSettings",
        settings: {
          googleAppsScriptUrl: emailSettings.googleAppsScriptUrl,
          senderEmail: emailSettings.senderEmail
        }
      })
    });
    alert("Email + PDF settings saved. The URL is saved in this browser and sent to the Google Sheet Settings tab.");
  } catch (err) {
    console.warn("Could not save URL to Google Sheet Settings tab.", err);
    alert("Email + PDF settings saved in this browser. I could not confirm saving to the Google Sheet Settings tab, but the app can now use this URL on this device.");
  }
}

function getJobs() {
  const jobs = getJSON("materialOrderJobs", DEFAULT_JOBS);
  return Array.isArray(jobs) ? jobs : copy(DEFAULT_JOBS);
}

function saveJobs(jobs) {
  setJSON("materialOrderJobs", jobs);
}

function getCategories() {
  const categories = getJSON("materialOrderCategories", DEFAULT_CATEGORIES);
  return categories && typeof categories === "object" ? categories : copy(DEFAULT_CATEGORIES);
}

function saveCategories(categories) {
  const cleaned = dedupeCategoryItems(categories);
  setJSON("materialOrderCategories", cleaned);
  syncMaterialsToGoogleSheet(cleaned);
}


function showAdminPage(pageId) {
  document.getElementById("adminScreen").classList.remove("hidden-admin");
  const materialScreen = document.getElementById("materialAdminScreen");
  if (materialScreen) materialScreen.classList.add("hidden-admin");

  document.querySelectorAll("#adminScreen .admin-page").forEach(page => {
    page.classList.toggle("active-admin-page", page.id === pageId);
  });

  document.querySelectorAll(".admin-nav button[data-admin-page]").forEach(button => {
    button.classList.toggle("active", button.dataset.adminPage === pageId);
  });
}

function showAdminHome() {
  showAdminPage("adminDashboardPage");
}


let adminMaterialCategories = [];

function normalizeMaterialCategoryRowsAdmin(rows) {
  return (rows || [])
    .filter(row => {
      const activeValue = String(row.active ?? row.Active ?? "TRUE").trim().toLowerCase();
      return !(activeValue === "false" || activeValue === "no" || activeValue === "0" || activeValue === "inactive");
    })
    .map(row => ({
      category: String(row.category ?? row.Category ?? "").trim(),
      categoryLabel: String(row.categoryLabel ?? row["Category Label"] ?? row.CategoryLabel ?? row.Category ?? "").trim(),
      sortOrder: Number(row.sortOrder ?? row.SortOrder ?? 999999)
    }))
    .filter(row => row.category)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

async function loadMaterialCategoriesForAdmin() {
  const list = document.getElementById("materialCategoriesAdminList");
  const select = document.getElementById("materialCategorySelect");

  if (list) list.innerHTML = "<p class='admin-note'>Loading categories...</p>";
  if (select) select.innerHTML = '<option value="">Loading categories...</option>';

  const url = getGoogleAppsScriptUrl();
  if (!url) {
    if (list) list.innerHTML = "<p class='admin-error'>Google Apps Script URL is missing.</p>";
    return [];
  }

  try {
    const response = await fetch(url + "?action=materialCategories&v=" + Date.now(), { cache: "no-store" });
    const data = await response.json();
    adminMaterialCategories = normalizeMaterialCategoryRowsAdmin(data.materialCategories || []);

    if (!adminMaterialCategories.length) {
      if (list) list.innerHTML = "<p class='admin-note'>No categories found in the MaterialCategories sheet.</p>";
      if (select) select.innerHTML = '<option value="">No categories found</option>';
      return [];
    }

    renderMaterialCategoryAdminList();
    renderMaterialCategoryDropdown();

    // Also load existing materials after categories come in.
    await loadMaterialsFromGoogleSheetAdmin();

    return adminMaterialCategories;
  } catch (error) {
    console.error(error);
    if (list) list.innerHTML = "<p class='admin-error'>Could not load categories. Check Apps Script deployment and MaterialCategories sheet.</p>";
    if (select) select.innerHTML = '<option value="">Could not load categories</option>';
    return [];
  }
}

function renderMaterialCategoryAdminList() {
  const list = document.getElementById("materialCategoriesAdminList");
  if (!list) return;

  if (!adminMaterialCategories.length) {
    list.innerHTML = "<p class='admin-note'>No categories found.</p>";
    return;
  }

  const selected = document.getElementById("materialCategorySelect")?.value || "";

  list.innerHTML = adminMaterialCategories.map(cat => `
    <button type="button" class="material-category-admin-row ${selected === cat.category ? "active" : ""}" data-select-material-category="${safeText(cat.category)}">
      <strong>${safeText(cat.categoryLabel || cat.category)}</strong>
      <span>${safeText(cat.category)}</span>
    </button>
  `).join("");

  document.querySelectorAll("[data-select-material-category]").forEach(button => {
    button.addEventListener("click", () => {
      const select = document.getElementById("materialCategorySelect");
      if (select) {
        select.value = button.dataset.selectMaterialCategory;
        renderMaterialsForAdmin();
        renderMaterialCategoryAdminList();
      }
    });
  });
}

function renderMaterialCategoryDropdown(preferredKey) {
  const select = document.getElementById("materialCategorySelect");
  if (!select) return;

  const previousValue = preferredKey || select.value || (adminMaterialCategories[0] && adminMaterialCategories[0].category) || "";
  select.innerHTML = adminMaterialCategories
    .map(cat => `<option value="${safeText(cat.category)}">${safeText(cat.categoryLabel || cat.category)}</option>`)
    .join("");

  if (previousValue && adminMaterialCategories.some(cat => cat.category === previousValue)) {
    select.value = previousValue;
  } else if (adminMaterialCategories.length) {
    select.value = adminMaterialCategories[0].category;
  }

  // Merge category shell into local categories so materials can be added.
  const current = getCategories();
  const next = {};
  adminMaterialCategories.forEach(cat => {
    next[cat.category] = {
      label: cat.categoryLabel || cat.category,
      items: current[cat.category] && Array.isArray(current[cat.category].items) ? current[cat.category].items : []
    };
  });
  localStorage.setItem("materialOrderCategories", JSON.stringify(next));

  renderMaterialsForAdmin();
  renderMaterialCategoryAdminList();
}

async function refreshMaterialCategorySelectAdmin(preferredKey) {
  await loadMaterialCategoriesForAdmin();
  if (preferredKey) renderMaterialCategoryDropdown(preferredKey);
}


function showMaterialAdmin() {
  document.getElementById("adminScreen").classList.add("hidden-admin");
  document.getElementById("materialAdminScreen").classList.remove("hidden-admin");
  loadMaterialCategoriesForAdmin();
}

function showAdmin() {
  document.getElementById("loginScreen").classList.add("hidden-admin");
  document.getElementById("adminScreen").classList.remove("hidden-admin");
  const materialScreen = document.getElementById("materialAdminScreen");
  if (materialScreen) materialScreen.classList.add("hidden-admin");
  loadSettingsForm();
  renderJobs();
  showAdminPage("adminDashboardPage");
}

async function login() {
  const usernameEl = document.getElementById("adminUsername");
  const passwordEl = document.getElementById("adminPassword");
  const username = usernameEl ? usernameEl.value.trim() : "";
  const password = passwordEl ? passwordEl.value : "";
  const errorEl = document.getElementById("loginError");
  if (!username || !password) { if (errorEl) errorEl.textContent = "Enter username and password."; return; }
  try {
    const user = await loginWithSheet(username, password);
    if (!isAdminUser(user)) { clearCurrentUser(); if (errorEl) errorEl.textContent = "This account is not an admin."; return; }
    if (errorEl) errorEl.textContent = "";
    sessionStorage.setItem("materialOrderAdmin", "true");
    showAdmin();
    addUserPill();
    if (user.mustChangePassword) setTimeout(() => showAccountModal(true), 300);
  } catch (err) {
    if (errorEl) errorEl.textContent = err.message;
  }
}

function resetAdminLogin() {
  localStorage.removeItem("materialOrderSettings");

  const settings = {
    companyTitle: "AC General",
    mainPageTitle: "Jobs",
    webpageTitle: "Material Orders",
    adminPassword: DEFAULT_PASSWORD,
    pdfLetterhead: DEFAULT_PDF_LETTERHEAD
  };

  saveSettings(settings);

  const passwordInput = document.getElementById("adminPassword");
  const error = document.getElementById("loginError");

  if (passwordInput) passwordInput.value = "";
  if (error) {
    error.textContent = "Admin login reset. Password is now: password";
    error.style.color = "#22c55e";
  }

  alert("Admin password reset to default.");
}

function setValueIfExists(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

function loadSettingsForm() {
  const settings = getSettings();
  const pdf = mergePdfLetterhead(settings);
  document.title = "Admin - " + (settings.webpageTitle || "Material Orders");
  document.getElementById("companyTitleInput").value = settings.companyTitle || DEFAULT_SETTINGS.companyTitle;
  const main = document.getElementById("mainPageTitleInput");
  if (main) main.value = settings.mainPageTitle || "Jobs";
  const webpageTitle = document.getElementById("webpageTitleInput");
  if (webpageTitle) webpageTitle.value = settings.webpageTitle || "Material Orders";
  setValueIfExists("googleAppsScriptUrlInput", settings.googleAppsScriptUrl || DEFAULT_SETTINGS.googleAppsScriptUrl);
  setValueIfExists("googleAppsScriptUrlInputDashboard", settings.googleAppsScriptUrl || DEFAULT_SETTINGS.googleAppsScriptUrl);
  setValueIfExists("googleAppsScriptUrlInputAppSettings", settings.googleAppsScriptUrl || DEFAULT_SETTINGS.googleAppsScriptUrl);
  setValueIfExists("senderEmailInput", settings.senderEmail || DEFAULT_SETTINGS.senderEmail);
  setValueIfExists("senderEmailInputDashboard", settings.senderEmail || DEFAULT_SETTINGS.senderEmail);
  setValueIfExists("senderEmailInputAppSettings", settings.senderEmail || DEFAULT_SETTINGS.senderEmail);
  setValueIfExists("estimatingToInput", settings.estimatingToEmail || "");
  setValueIfExists("estimatingFromEmailInput", settings.senderEmail || DEFAULT_SETTINGS.senderEmail);
  setValueIfExists("estimatingSenderNameInput", settings.estimatingSenderName || DEFAULT_SETTINGS.estimatingSenderName);
  setValueIfExists("estimatingCcInput", settings.estimatingCcEmail || "");
  setValueIfExists("estimatingHeadingInput", settings.estimatingEmailHeading || DEFAULT_SETTINGS.estimatingEmailHeading);
  setValueIfExists("estimatingQuoteContactInput", settings.estimatingQuoteContact || DEFAULT_SETTINGS.estimatingQuoteContact);

  setValueIfExists("pdfTitleLine1Input", pdf.titleLine1);
  setValueIfExists("pdfTitleLine2Input", pdf.titleLine2);
  setValueIfExists("pdfAddressInput", pdf.address);
  setValueIfExists("pdfPhoneFaxInput", pdf.phoneFax);
  setValueIfExists("pdfWebsiteInput", pdf.website);
  setValueIfExists("pdfLicenseInput", pdf.license);
  setValueIfExists("pdfCompanyNameInput", pdf.companyName || settings.companyTitle);
  setValueIfExists("pdfDocumentTitleInput", pdf.documentTitle);
  setValueIfExists("pdfFooterMessageInput", pdf.footerMessage);
  updateLetterheadPreview();
}

function saveCompanyTitle() {
  const companyTitle = document.getElementById("companyTitleInput").value.trim();
  const mainPageTitle = (document.getElementById("mainPageTitleInput")?.value || "Jobs").trim();
  const webpageTitle = (document.getElementById("webpageTitleInput")?.value || "Material Orders").trim();

  if (!companyTitle || !mainPageTitle || !webpageTitle) {
    alert("Company title, main page title, and browser tab title are required.");
    return;
  }

  const existing = getSettings();
  const emailSettings = readEmailPdfInputs();
  const settings = {
    ...existing,
    companyTitle,
    mainPageTitle,
    webpageTitle,
    adminPassword: existing.adminPassword || DEFAULT_PASSWORD,
    googleAppsScriptUrl: emailSettings.googleAppsScriptUrl || existing.googleAppsScriptUrl || "",
    senderEmail: emailSettings.senderEmail || existing.senderEmail || "",
    pdfLetterhead: mergePdfLetterhead(existing)
  };

  saveSettings(settings);
  loadSettingsForm();
  alert("App settings saved.");
}

function updateLetterheadPreview() {
  const settings = getSettings();
  const pdf = mergePdfLetterhead(settings);
  const left = document.getElementById("pdfLeftLogoPreview");
  const right = document.getElementById("pdfRightLogoPreview");
  if (left) left.src = pdf.leftLogo || DEFAULT_PDF_LETTERHEAD.leftLogo;
  if (right) right.src = pdf.rightLogo || DEFAULT_PDF_LETTERHEAD.rightLogo;
  const title = document.getElementById("letterheadPreviewTitle");
  if (title) title.innerHTML = `${safeText(pdf.titleLine1 || "")}<br />${safeText(pdf.titleLine2 || "")}`;
  const company = document.getElementById("letterheadPreviewCompany");
  if (company) company.textContent = `${pdf.companyName || getSettings().companyTitle || "Company"} Material Order PDF`;
}

function getPdfLetterheadFromForm(existing) {
  return {
    ...mergePdfLetterhead({ pdfLetterhead: existing || {} }),
    titleLine1: document.getElementById("pdfTitleLine1Input").value.trim() || DEFAULT_PDF_LETTERHEAD.titleLine1,
    titleLine2: document.getElementById("pdfTitleLine2Input").value.trim() || DEFAULT_PDF_LETTERHEAD.titleLine2,
    address: document.getElementById("pdfAddressInput").value.trim(),
    phoneFax: document.getElementById("pdfPhoneFaxInput").value.trim(),
    website: document.getElementById("pdfWebsiteInput").value.trim(),
    license: document.getElementById("pdfLicenseInput").value.trim(),
    companyName: document.getElementById("pdfCompanyNameInput").value.trim() || document.getElementById("companyTitleInput").value.trim() || DEFAULT_PDF_LETTERHEAD.companyName,
    documentTitle: document.getElementById("pdfDocumentTitleInput").value.trim() || DEFAULT_PDF_LETTERHEAD.documentTitle,
    footerMessage: document.getElementById("pdfFooterMessageInput").value.trim() || DEFAULT_PDF_LETTERHEAD.footerMessage
  };
}

async function savePdfLetterhead() {
  const settings = getSettings();
  let pdf = getPdfLetterheadFromForm(settings.pdfLetterhead);

  const leftInput = document.getElementById("pdfLeftLogoInput");
  const rightInput = document.getElementById("pdfRightLogoInput");

  if (leftInput && leftInput.files && leftInput.files[0]) {
    pdf.leftLogo = await readFileAsDataUrl(leftInput.files[0]);
  }

  if (rightInput && rightInput.files && rightInput.files[0]) {
    pdf.rightLogo = await readFileAsDataUrl(rightInput.files[0]);
  }

  settings.pdfLetterhead = pdf;
  saveSettings(settings);
  updateLetterheadPreview();
  alert("PDF letterhead saved.");
}

function resetPdfLetterhead() {
  const settings = getSettings();
  settings.pdfLetterhead = { ...DEFAULT_PDF_LETTERHEAD };
  saveSettings(settings);
  loadSettingsForm();
  alert("PDF letterhead reset to the default letterhead.");
}

function savePassword() {
  const settings = getSettings();
  const current = document.getElementById("currentPasswordInput").value.trim();
  const next = document.getElementById("newPasswordInput").value.trim();
  const confirmPassword = document.getElementById("confirmPasswordInput").value.trim();
  const message = document.getElementById("passwordMessage");

  message.classList.remove("error");
  message.textContent = "";

  if (current !== settings.adminPassword && current !== DEFAULT_PASSWORD) {
    message.textContent = "Current password is wrong.";
    message.classList.add("error");
    return;
  }

  if (next.length < 4) {
    message.textContent = "New password must be at least 4 characters.";
    message.classList.add("error");
    return;
  }

  if (next !== confirmPassword) {
    message.textContent = "New passwords do not match.";
    message.classList.add("error");
    return;
  }

  settings.adminPassword = next;
  saveSettings(settings);
  document.getElementById("currentPasswordInput").value = "";
  document.getElementById("newPasswordInput").value = "";
  document.getElementById("confirmPasswordInput").value = "";
  message.textContent = "Password updated.";
}

function addJob() {
  const input = document.getElementById("newJobName");
  const name = input.value.trim();
  if (!name) {
    alert("Enter a job name.");
    return;
  }
  const jobs = getJobs();
  if (jobs.some(job => job.name.toLowerCase() === name.toLowerCase())) {
    alert("That job already exists.");
    return;
  }
  jobs.push({ name, active: true, email: "nmcdonald@acgeneral.net" });
  saveJobs(jobs);
  input.value = "";
  renderJobs();
}

function updateJob(index, value, emailValue) {
  const jobs = getJobs();
  const name = value.trim();
  const email = (emailValue || "").trim() || "nmcdonald@acgeneral.net";

  if (!name) {
    alert("Job name cannot be blank.");
    renderJobs();
    return;
  }

  jobs[index].name = name;
  jobs[index].email = email;
  saveJobs(jobs);
  renderJobs();
}

function toggleJob(index) {
  const jobs = getJobs();
  jobs[index].active = jobs[index].active === false ? true : false;
  saveJobs(jobs);
  renderJobs();
}

function deleteJob(index) {
  const jobs = getJobs();
  const name = jobs[index].name;
  if (!confirm(`Delete job "${name}"?`)) return;
  jobs.splice(index, 1);
  saveJobs(jobs);
  renderJobs();
}

function resetJobs() {
  if (!confirm("Reset job list back to default?")) return;
  saveJobs(copy(DEFAULT_JOBS));
  renderJobs();
}

function renderJobs() {
  const jobs = getJobs();
  const list = document.getElementById("jobManagerList");

  if (!jobs.length) {
    list.innerHTML = "<p class='admin-note'>No jobs added yet.</p>";
    return;
  }

  list.innerHTML = jobs.map((job, index) => `
    <div class="job-manager-row ${job.active === false ? "inactive-job" : ""}">
      <div class="job-edit-fields">
        <label class="admin-label">Job Name
          <input value="${safeText(job.name)}" data-index="${index}" />
        </label>
        <label class="admin-label">Order Email
          <input value="${safeText(job.email || "nmcdonald@acgeneral.net")}" data-email-index="${index}" placeholder="orders@example.com" />
        </label>
      </div>
      <div class="job-actions">
        <button class="save-job" data-save="${index}" type="button">Save</button>
        <button class="toggle-job" data-toggle="${index}" type="button">${job.active === false ? "Activate" : "Hide"}</button>
        <button class="delete-job" data-delete="${index}" type="button">Delete</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-save]").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.save);
      const input = document.querySelector(`input[data-index="${index}"]`);
      const emailInput = document.querySelector(`input[data-email-index="${index}"]`);
      updateJob(index, input.value, emailInput ? emailInput.value : "nmcdonald@acgeneral.net");
    });
  });

  document.querySelectorAll("[data-toggle]").forEach(button => {
    button.addEventListener("click", () => toggleJob(Number(button.dataset.toggle)));
  });

  document.querySelectorAll("[data-delete]").forEach(button => {
    button.addEventListener("click", () => deleteJob(Number(button.dataset.delete)));
  });
}

function parseCsvList(value) {
  return value.split(",").map(item => item.trim()).filter(Boolean);
}

function materialDedupeKey(categoryKey, name) {
  return String(categoryKey || "").trim().toLowerCase() + "::" + String(name || "").trim().toLowerCase();
}

function dedupeCategoryItems(categories) {
  const cleaned = JSON.parse(JSON.stringify(categories || {}));
  Object.entries(cleaned).forEach(([categoryKey, category]) => {
    const seen = new Set();
    const items = category && Array.isArray(category.items) ? category.items : [];
    category.items = items.filter(item => {
      const key = materialDedupeKey(categoryKey, item && item.name);
      if (!item || !item.name || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  });
  return cleaned;
}


/* V116 clean material category helpers */
function slugifyMaterialCategoryKey(value) {
  const source = String(value || "").trim();
  if (!source) return "";
  const cleaned = source
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "");
  if (!cleaned) return "";
  return cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
}

function buildAdminCategoriesFromCategoryRows(categoryRows) {
  const categories = {};
  (categoryRows || []).forEach(row => {
    const activeValue = String(row.active ?? row.Active ?? "TRUE").trim().toLowerCase();
    if (activeValue === "false" || activeValue === "no" || activeValue === "0" || activeValue === "inactive") return;
    const key = String(row.category ?? row.Category ?? "").trim();
    const label = String(row.categoryLabel ?? row["Category Label"] ?? row.CategoryLabel ?? key).trim();
    if (!key) return;
    categories[key] = { label: label || key, items: [] };
  });
  return categories;
}

function categoriesToMaterialCategoryRows(categories) {
  return Object.entries(categories || {}).map(([key, category], index) => ({
    Category: String(key || "").trim(),
    "Category Label": String((category && category.label) || key || "").trim(),
    Active: true,
    SortOrder: index + 1
  }));
}

function normalizeMaterialCategoryRowsV116(rows) {
  return (rows || [])
    .filter(row => {
      const activeValue = String(row.active ?? row.Active ?? "TRUE").trim().toLowerCase();
      return !(activeValue === "false" || activeValue === "no" || activeValue === "0" || activeValue === "inactive");
    })
    .map(row => ({
      category: String(row.category ?? row.Category ?? "").trim(),
      categoryLabel: String(row.categoryLabel ?? row["Category Label"] ?? row.CategoryLabel ?? row.Category ?? "").trim(),
      sortOrder: Number(row.sortOrder ?? row.SortOrder ?? 999999)
    }))
    .filter(row => row.category)
    .sort((a,b) => a.sortOrder - b.sortOrder);
}


function categoriesToMaterialRows(categories) {
  const rows = [];
  const cleanedCategories = dedupeCategoryItems(categories);

  Object.entries(cleanedCategories || {}).forEach(([categoryKey, category]) => {
    const categoryLabel = category && category.label ? category.label : categoryKey;
    const items = category && Array.isArray(category.items) ? category.items : [];

    items.forEach((item, index) => {
      rows.push({
        Category: categoryKey,
        "Category Label": categoryLabel,
        Material: item.name || "",
        Icon: item.icon || "",
        Options: Array.isArray(item.options) ? item.options.join(", ") : "",
        Units: Array.isArray(item.units) ? item.units.join(", ") : "Each",
        Active: true,
        SortOrder: index + 1
      });
    });
  });

  return rows;
}

function materialRowsToCategories(rows, categoryRows) {
  const categories = buildAdminCategoriesFromCategoryRows(categoryRows);
  if (!Array.isArray(rows)) return null;

  const sortedRows = [...rows].sort((a, b) => {
    const ac = String(a.category ?? a.Category ?? "").localeCompare(String(b.category ?? b.Category ?? ""));
    if (ac !== 0) return ac;
    const ao = Number(a.sortOrder ?? a.SortOrder ?? 999999);
    const bo = Number(b.sortOrder ?? b.SortOrder ?? 999999);
    return ao - bo;
  });

  sortedRows.forEach(row => {
    const activeValue = String(row.active ?? row.Active ?? "TRUE").trim().toLowerCase();
    if (activeValue === "false" || activeValue === "no" || activeValue === "0" || activeValue === "inactive") return;

    const categoryKey = String(row.category ?? row.Category ?? "").trim();
    const categoryLabel = String(row.categoryLabel ?? row["Category Label"] ?? row.CategoryLabel ?? categoryKey).trim();
    const materialName = String(row.material ?? row.Material ?? "").trim();
    if (!categoryKey) return;

    if (!categories[categoryKey]) {
      categories[categoryKey] = { label: categoryLabel || categoryKey, items: [] };
    }

    // Category-only rows let Admin create a new category before materials are added.
    if (!materialName) return;

    if (categories[categoryKey].items.some(existing => materialDedupeKey(categoryKey, existing.name) === materialDedupeKey(categoryKey, materialName))) {
      return;
    }

    const item = {
      icon: String(row.icon ?? row.Icon ?? "").trim() || "📦",
      name: materialName,
      units: parseCsvList(String(row.units ?? row.Units ?? "Each"))
    };

    if (!item.units.length) item.units = ["Each"];

    const options = parseCsvList(String(row.options ?? row.Options ?? ""));
    if (options.length) item.options = options;

    categories[categoryKey].items.push(item);
  });

  return Object.keys(categories).length ? categories : null;
}

async function syncMaterialsToGoogleSheet(categories) {
  const url = getGoogleAppsScriptUrl();
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "saveMaterials",
        materials: categoriesToMaterialRows(categories)
      })
    });
    await syncMaterialCategoriesToGoogleSheet(categories);
  } catch (error) {
    console.warn("Could not sync materials to Google Sheet.", error);
  }
}

async function loadMaterialsFromGoogleSheetAdmin() {
  const url = getGoogleAppsScriptUrl();
  if (!url) return false;

  try {
    const response = await fetch(url + "?action=materials&v=" + Date.now(), { cache: "no-store" });
    const data = await response.json();
    const categories = materialRowsToCategories(data.materials || [], data.materialCategories || []);
    if (!categories) return false;

    const cleaned = dedupeCategoryItems(categories);
    setJSON("materialOrderCategories", cleaned);
    renderMaterialCategorySelect();
    syncMaterialsToGoogleSheet(cleaned);
    return true;
  } catch (error) {
    console.warn("Could not load Materials tab from Google Sheet.", error);
    return false;
  }
}


async function loadMaterialCategoriesDirectAdmin() {
  const url = getGoogleAppsScriptUrl();
  const fallback = getCategories();
  if (!url) return fallback;

  try {
    const response = await fetch(url + "?action=materialCategories&v=" + Date.now(), { cache: "no-store" });
    const data = await response.json();
    const rows = data.materialCategories || [];

    const nextCategories = {};
    if (Array.isArray(rows)) {
      rows
        .filter(row => {
          const activeValue = String(row.active ?? row.Active ?? "TRUE").trim().toLowerCase();
          return !(activeValue === "false" || activeValue === "no" || activeValue === "0" || activeValue === "inactive");
        })
        .sort((a, b) => Number(a.sortOrder ?? a.SortOrder ?? 999999) - Number(b.sortOrder ?? b.SortOrder ?? 999999))
        .forEach(row => {
          const key = String(row.category ?? row.Category ?? "").trim();
          const label = String(row.categoryLabel ?? row["Category Label"] ?? row.CategoryLabel ?? key).trim();
          if (!key) return;
          nextCategories[key] = { label: label || key, items: [] };
        });
    }

    // Load material rows and place them ONLY under categories that exist in MaterialCategories.
    // This prevents old category names in the Materials sheet from reappearing after you rename/delete them.
    try {
      const materialResponse = await fetch(url + "?action=materials&v=" + Date.now(), { cache: "no-store" });
      const materialData = await materialResponse.json();
      const materialCategories = materialRowsToCategories(materialData.materials || [], Object.values(nextCategories).length ? Object.entries(nextCategories).map(([category, obj], index) => ({
        category,
        categoryLabel: obj.label,
        active: true,
        sortOrder: index + 1
      })) : (materialData.materialCategories || []));

      Object.keys(nextCategories).forEach(key => {
        nextCategories[key].items = materialCategories[key] && Array.isArray(materialCategories[key].items) ? materialCategories[key].items : [];
      });
    } catch (materialError) {
      console.warn("Could not load materials while refreshing categories.", materialError);
    }

    if (Object.keys(nextCategories).length) {
      localStorage.setItem("materialOrderCategories", JSON.stringify(nextCategories));
      return nextCategories;
    }
  } catch (error) {
    console.warn("Could not load MaterialCategories directly.", error);
  }

  return fallback;
}

async function refreshMaterialCategorySelectAdmin(preferredKey) {
  const btn = document.getElementById("refreshMaterialCategoriesBtn");
  const oldText = btn ? btn.textContent : "";
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Refreshing...";
  }

  await loadMaterialCategoriesDirectAdmin();
  renderMaterialCategorySelect(preferredKey);

  if (btn) {
    btn.disabled = false;
    btn.textContent = oldText || "Refresh Categories";
  }
}

function renderMaterialCategorySelect(preferredKey) {
  if (adminMaterialCategories && adminMaterialCategories.length) {
    renderMaterialCategoryDropdown(preferredKey);
    return;
  }
  loadMaterialCategoriesForAdmin();
}

async function addMaterialCategory() {
  const nameEl = document.getElementById("newMaterialCategoryName");
  const keyEl = document.getElementById("newMaterialCategoryKey");
  const label = nameEl ? nameEl.value.trim() : "";
  const requestedKey = keyEl ? keyEl.value.trim() : "";
  const key = slugifyMaterialCategoryKey(requestedKey || label);

  if (!label) {
    alert("Enter a category name.");
    return;
  }

  if (!key) {
    alert("Could not create a category key. Try a different name.");
    return;
  }

  await loadMaterialCategoriesForAdmin();

  if (adminMaterialCategories.some(cat => cat.category.toLowerCase() === key.toLowerCase())) {
    alert("That category already exists.");
    renderMaterialCategoryDropdown(key);
    return;
  }

  adminMaterialCategories.push({
    category: key,
    categoryLabel: label,
    sortOrder: adminMaterialCategories.length + 1
  });

  const url = getGoogleAppsScriptUrl();
  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "saveMaterialCategories",
      materialCategories: adminMaterialCategories.map((cat, index) => ({
        Category: cat.category,
        "Category Label": cat.categoryLabel,
        Active: true,
        SortOrder: index + 1
      }))
    })
  });

  if (nameEl) nameEl.value = "";
  if (keyEl) keyEl.value = "";

  renderMaterialCategoryDropdown(key);
  setTimeout(() => loadMaterialCategoriesForAdmin(), 800);
  alert("Category added.");
}

async function addMaterial() {
  const categorySelect = document.getElementById("materialCategorySelect");
  const categoryKey = categorySelect ? categorySelect.value : "";
  const name = document.getElementById("materialNameInput").value.trim();
  const icon = document.getElementById("materialIconInput").value.trim() || "•";
  const options = parseCsvList(document.getElementById("materialOptionsInput").value);
  const units = parseCsvList(document.getElementById("materialUnitsInput").value);

  if (!adminMaterialCategories.length) {
    await loadMaterialCategoriesForAdmin();
  }

  if (!categoryKey || !name) {
    alert("Select a category and enter a material name.");
    return;
  }

  const categories = getCategories();
  const foundCat = adminMaterialCategories.find(cat => cat.category === categoryKey);

  if (!categories[categoryKey]) {
    categories[categoryKey] = {
      label: foundCat ? foundCat.categoryLabel : categoryKey,
      items: []
    };
  }

  if (categories[categoryKey].items.some(item => item.name.toLowerCase() === name.toLowerCase())) {
    alert("That material already exists.");
    return;
  }

  const newItem = { icon, name, units: units.length ? units : ["Each"] };
  if (options.length) newItem.options = options;

  categories[categoryKey].items.push(newItem);
  saveCategories(categories);

  document.getElementById("materialNameInput").value = "";
  document.getElementById("materialIconInput").value = "";
  document.getElementById("materialOptionsInput").value = "";
  document.getElementById("materialUnitsInput").value = "";

  renderMaterialsForAdmin();
  alert("Material added.");
}

function saveMaterialEdit(index) {
  const categoryKey = document.getElementById("materialCategorySelect").value;
  const categories = getCategories();

  if (!categories[categoryKey] || !categories[categoryKey].items[index]) {
    alert("Material not found.");
    return;
  }

  const icon = document.querySelector(`[data-material-icon="${index}"]`).value.trim() || "•";
  const name = document.querySelector(`[data-material-name="${index}"]`).value.trim();
  const options = parseCsvList(document.querySelector(`[data-material-options="${index}"]`).value);
  const units = parseCsvList(document.querySelector(`[data-material-units="${index}"]`).value);

  if (!name) {
    alert("Material name cannot be blank.");
    return;
  }

  categories[categoryKey].items[index] = {
    icon,
    name,
    units: units.length ? units : ["Each"]
  };

  if (options.length) {
    categories[categoryKey].items[index].options = options;
  }

  saveCategories(categories);
  renderMaterialsForAdmin();
}

function moveMaterial(index, direction) {
  const categoryKey = document.getElementById("materialCategorySelect").value;
  const categories = getCategories();

  if (!categories[categoryKey] || !categories[categoryKey].items[index]) return;

  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= categories[categoryKey].items.length) return;

  const items = categories[categoryKey].items;
  const [moved] = items.splice(index, 1);
  items.splice(newIndex, 0, moved);

  saveCategories(categories);
  renderMaterialsForAdmin();
}

function deleteMaterial(index) {
  const categoryKey = document.getElementById("materialCategorySelect").value;
  const categories = getCategories();
  const item = categories[categoryKey].items[index];

  if (!confirm(`Delete material "${item.name}"?`)) return;

  categories[categoryKey].items.splice(index, 1);
  saveCategories(categories);
  renderMaterialsForAdmin();
}

function renderMaterialIcon(icon) {
  const value = String(icon || "");
  if (value.includes("/") || value.endsWith(".png") || value.endsWith(".jpg") || value.endsWith(".jpeg") || value.endsWith(".svg") || value.endsWith(".webp")) {
    return `<img class="material-icon-img" src="${safeText(value)}" alt="" loading="lazy" />`;
  }
  return safeText(value);
}

function renderMaterialsForAdmin() {
  const categoryKey = document.getElementById("materialCategorySelect").value;
  const list = document.getElementById("materialManagerList");
  const categories = getCategories();
  const items = (categories[categoryKey] && categories[categoryKey].items) || [];

  if (!items.length) {
    list.innerHTML = "<p class='admin-note'>No materials in this category.</p>";
    return;
  }

  list.innerHTML = items.map((item, index) => {
    const options = item.options && item.options.length ? item.options.join(", ") : "";
    const units = item.units && item.units.length ? item.units.join(", ") : "Each";

    return `
      <div class="material-manager-row editable-material-row">
        <div class="material-edit-grid">
          <label class="admin-label">Icon
            <input value="${safeText(item.icon || "•")}" data-material-icon="${index}" />
          </label>

          <label class="admin-label">Material Name
            <input value="${safeText(item.name)}" data-material-name="${index}" />
          </label>

          <label class="admin-label wide">Size Options
            <input value="${safeText(options)}" data-material-options="${index}" placeholder='Example: 1/4", 3/8", 1/2"' />
          </label>

          <label class="admin-label wide">Unit Options
            <input value="${safeText(units)}" data-material-units="${index}" placeholder="Example: Box, Each" />
          </label>
        </div>

        <div class="material-edit-actions">
          <button class="save-material" data-move-material-up="${index}" type="button" ${index === 0 ? "disabled" : ""}>Move Up</button>
          <button class="save-material" data-move-material-down="${index}" type="button" ${index === items.length - 1 ? "disabled" : ""}>Move Down</button>
          <button class="save-material" data-save-material="${index}" type="button">Save</button>
          <button class="delete-material" data-delete-material="${index}" type="button">Delete</button>
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll("[data-move-material-up]").forEach(button => {
    button.addEventListener("click", () => moveMaterial(Number(button.dataset.moveMaterialUp), -1));
  });

  document.querySelectorAll("[data-move-material-down]").forEach(button => {
    button.addEventListener("click", () => moveMaterial(Number(button.dataset.moveMaterialDown), 1));
  });

  document.querySelectorAll("[data-save-material]").forEach(button => {
    button.addEventListener("click", () => saveMaterialEdit(Number(button.dataset.saveMaterial)));
  });

  document.querySelectorAll("[data-delete-material]").forEach(button => {
    button.addEventListener("click", () => deleteMaterial(Number(button.dataset.deleteMaterial)));
  });
}


function getOrders() {
  try {
    const saved = localStorage.getItem("materialOrderBoardOrders");
    const orders = saved ? JSON.parse(saved) : [];
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem("materialOrderBoardOrders", JSON.stringify(orders));
}

function statusClass(status) {
  return String(status || "Pending").toLowerCase();
}

function formatOrderDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  } catch {
    return value;
  }
}

function renderAdminOrders() {
  const list = document.getElementById("adminOrdersList");
  if (!list) return;

  const orders = getOrders().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const showOrderControls = canManageOrders();

  if (!orders.length) {
    list.innerHTML = "<p class='admin-note'>No orders submitted yet.</p>";
    return;
  }

  list.innerHTML = orders.map(order => `
    <div class="admin-order-row">
      <div class="admin-order-head">
        <div>
          <strong>${safeText(order.job || "Unknown Job")}</strong>
          <span>Requested by ${safeText(order.requestedBy || "Unknown")} • ${safeText(formatOrderDate(order.createdAt))}</span>
        </div>
        <span class="status-badge ${statusClass(order.status)}">${safeText(order.status || "Pending")}</span>
      </div>
      <div class="admin-order-items">
        ${(order.items || []).map(item => `<div>${safeText(item.name)} <b>${safeText(item.qty)} ${safeText(item.unit)}</b></div>`).join("")}
      </div>
      ${order.notes ? `<p class="admin-order-notes"><b>Notes:</b> ${safeText(order.notes)}</p>` : ""}
      ${showOrderControls ? `
        <div class="admin-order-actions">
          <button type="button" class="status-pending" data-order-status="Pending" data-order-id="${safeText(order.id)}">Pending</button>
          <button type="button" class="status-ordered" data-order-status="Ordered" data-order-id="${safeText(order.id)}">Ordered</button>
          <button type="button" class="status-delivered" data-order-status="Delivered" data-order-id="${safeText(order.id)}">Delivered</button>
          <button type="button" class="delete-order" data-delete-order="${safeText(order.id)}">Delete</button>
        </div>
      ` : ""}
    </div>
  `).join("");

  if (showOrderControls) {
    document.querySelectorAll("[data-order-status]").forEach(button => {
      button.addEventListener("click", () => updateOrderStatus(button.dataset.orderId, button.dataset.orderStatus));
    });

    document.querySelectorAll("[data-delete-order]").forEach(button => {
      button.addEventListener("click", () => deleteAdminOrder(button.dataset.deleteOrder));
    });
  }
}

function updateOrderStatus(orderId, newStatus) {
  if (!canManageOrders()) return alert("You do not have permission to change order status.");
  const orders = getOrders();
  const order = orders.find(item => item.id === orderId);
  if (!order) return;

  order.status = newStatus;
  order.updatedAt = new Date().toISOString();
  saveOrders(orders);
}

function deleteAdminOrder(orderId) {
  if (!canManageOrders()) return alert("You do not have permission to delete orders.");
  const orders = getOrders();
  const order = orders.find(item => item.id === orderId);
  if (!order) return;

  const label = `${order.job || "this order"} - ${order.requestedBy || "Unknown"}`;
  if (!confirm(`Delete ${label}? This cannot be undone.`)) return;

  saveOrders(orders.filter(item => item.id !== orderId));
}





const DEFAULT_RENTAL_ITEMS_ADMIN = [
  { name: "Conex", icon: "🚚", active: true, custom: false },
  { name: "Lull", icon: "🚜", active: true, custom: false, options: ["6k", "8k", "10k", "12k"] },
  { name: "Scissor Lift", icon: "↕️", active: true, custom: false, options: ["19 ft", "26 ft", "32 ft", "40 ft"] },
  { name: "Boom Lift", icon: "🏗️", active: true, custom: false, options: ["45 ft", "60 ft", "80 ft", "125 ft"] },
  { name: "Porta John", icon: "🚻", active: true, custom: false },
  { name: "Other / Custom", icon: "➕", active: true, custom: true }
];

let rentalItemsAdminCache = [];

function normalizeRentalItems(items) {
  const cleaned = [];
  const seen = new Set();

  (items || []).forEach((item, index) => {
    const name = String(item.name || item["Rental Item"] || item.rentalItem || "").trim();
    if (!name) return;
    const key = name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);

    cleaned.push({
      name,
      icon: item.icon || item.Icon || "📦",
      active: !(item.active === false || item.Active === false || String(item.active || item.Active || "").toLowerCase() === "false"),
      custom: item.custom === true || item.Custom === true || String(item.custom || item.Custom || "").toLowerCase() === "true",
      options: String(item.options || item.Options || item.sizes || item.Sizes || "").split(",").map(part => part.trim()).filter(Boolean),
      sortOrder: Number(item.sortOrder || item.SortOrder || index + 1)
    });
  });

  if (!cleaned.some(item => item.custom)) {
    cleaned.push({ name: "Other / Custom", icon: "➕", active: true, custom: true, sortOrder: cleaned.length + 1 });
  }

  return cleaned.sort((a, b) => Number(a.sortOrder || 999999) - Number(b.sortOrder || 999999));
}

async function loadRentalItemsFromGoogleSheetAdmin() {
  const list = document.getElementById("rentalItemsAdminList");
  if (list) list.innerHTML = "<p class='admin-note'>Loading rental buttons...</p>";

  const url = getGoogleAppsScriptUrl();
  if (!url) {
    rentalItemsAdminCache = normalizeRentalItems(DEFAULT_RENTAL_ITEMS_ADMIN);
    renderRentalItemsAdmin();
    return false;
  }

  try {
    const response = await fetch(url + "?action=rentalItems&v=" + Date.now(), { cache: "no-store" });
    const data = await response.json();
    const rows = Array.isArray(data.rentalItems) && data.rentalItems.length ? data.rentalItems : DEFAULT_RENTAL_ITEMS_ADMIN;
    rentalItemsAdminCache = normalizeRentalItems(rows);
    localStorage.setItem("materialOrderRentalItems", JSON.stringify(rentalItemsAdminCache));
    renderRentalItemsAdmin();
    return true;
  } catch (error) {
    console.warn("Could not load RentalItems tab.", error);
    rentalItemsAdminCache = normalizeRentalItems(JSON.parse(localStorage.getItem("materialOrderRentalItems") || "[]").length ? JSON.parse(localStorage.getItem("materialOrderRentalItems") || "[]") : DEFAULT_RENTAL_ITEMS_ADMIN);
    renderRentalItemsAdmin();
    return false;
  }
}

async function saveRentalItemsAdmin(items) {
  const cleaned = normalizeRentalItems(items);
  rentalItemsAdminCache = cleaned;
  localStorage.setItem("materialOrderRentalItems", JSON.stringify(cleaned));
  renderRentalItemsAdmin();

  const url = getGoogleAppsScriptUrl();
  if (!url) {
    alert("Missing Google Apps Script URL. Rental button saved locally only.");
    return false;
  }

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "saveRentalItems", rentalItems: cleaned })
    });
    setTimeout(loadRentalItemsFromGoogleSheetAdmin, 700);
    return true;
  } catch (error) {
    console.warn("Could not sync rental buttons.", error);
    alert("Rental button saved locally, but did not sync to RentalItems sheet.");
    return false;
  }
}

function renderRentalItemsAdmin() {
  const list = document.getElementById("rentalItemsAdminList");
  if (!list) return;

  const items = normalizeRentalItems(rentalItemsAdminCache.length ? rentalItemsAdminCache : DEFAULT_RENTAL_ITEMS_ADMIN);

  if (!items.length) {
    list.innerHTML = "<p class='admin-note'>No rental buttons yet.</p>";
    return;
  }

  list.innerHTML = items.map((item, index) => `
    <div class="material-manager-row editable-material-row">
      <div class="material-edit-grid rental-edit-grid">
        <label class="admin-label rental-icon-field">Icon
          <input value="${safeText(item.icon || "📦")}" data-rental-icon="${index}" />
        </label>

        <label class="admin-label rental-name-field">Rental Item
          <input value="${safeText(item.name || "")}" data-rental-name="${index}" ${item.custom ? "readonly" : ""} />
        </label>

        <label class="admin-label rental-options-field">Sizes / Options
          <input value="${safeText((item.options || []).join(", "))}" data-rental-options="${index}" placeholder="Example: 6k, 8k, 10k" />
        </label>

        <label class="admin-label rental-active-field">Active
          <select data-rental-active="${index}">
            <option value="true" ${item.active !== false ? "selected" : ""}>Active</option>
            <option value="false" ${item.active === false ? "selected" : ""}>Not Active</option>
          </select>
        </label>
      </div>

      <div class="material-edit-actions">
        <button class="save-material" data-rental-up="${index}" type="button" ${index === 0 ? "disabled" : ""}>Move Up</button>
        <button class="save-material" data-rental-down="${index}" type="button" ${index === items.length - 1 ? "disabled" : ""}>Move Down</button>
        <button class="save-material" data-rental-save="${index}" type="button">Save</button>
        ${item.custom ? "" : `<button class="delete-material" data-rental-delete="${index}" type="button">Delete</button>`}
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-rental-save]").forEach(button => button.addEventListener("click", () => saveRentalButtonEdit(Number(button.dataset.rentalSave))));
  document.querySelectorAll("[data-rental-delete]").forEach(button => button.addEventListener("click", () => deleteRentalButton(Number(button.dataset.rentalDelete))));
  document.querySelectorAll("[data-rental-up]").forEach(button => button.addEventListener("click", () => moveRentalButton(Number(button.dataset.rentalUp), -1)));
  document.querySelectorAll("[data-rental-down]").forEach(button => button.addEventListener("click", () => moveRentalButton(Number(button.dataset.rentalDown), 1)));
}

async function addRentalItemAdmin() {
  const nameEl = document.getElementById("newRentalItemName");
  const iconEl = document.getElementById("newRentalItemIcon");
  const sizesEl = document.getElementById("newRentalItemSizes");
  const name = (nameEl ? nameEl.value : "").trim();
  const icon = (iconEl ? iconEl.value : "").trim() || "📦";
  const options = (sizesEl ? sizesEl.value : "").split(",").map(part => part.trim()).filter(Boolean);

  if (!name) return alert("Enter a rental item name.");

  const items = normalizeRentalItems(rentalItemsAdminCache.length ? rentalItemsAdminCache : DEFAULT_RENTAL_ITEMS_ADMIN);
  if (items.some(item => item.name.toLowerCase() === name.toLowerCase())) {
    return alert("That rental button already exists.");
  }

  const customIndex = items.findIndex(item => item.custom);
  items.splice(customIndex >= 0 ? customIndex : items.length, 0, { name, icon, options, active: true, custom: false, sortOrder: items.length + 1 });

  await saveRentalItemsAdmin(items);

  if (nameEl) nameEl.value = "";
  if (iconEl) iconEl.value = "";
  if (sizesEl) sizesEl.value = "";
}

async function saveRentalButtonEdit(index) {
  const items = normalizeRentalItems(rentalItemsAdminCache.length ? rentalItemsAdminCache : DEFAULT_RENTAL_ITEMS_ADMIN);
  if (!items[index]) return;

  const name = document.querySelector(`[data-rental-name="${index}"]`)?.value.trim() || "";
  const icon = document.querySelector(`[data-rental-icon="${index}"]`)?.value.trim() || "📦";
  const active = document.querySelector(`[data-rental-active="${index}"]`)?.value !== "false";
  const options = (document.querySelector(`[data-rental-options="${index}"]`)?.value || "").split(",").map(part => part.trim()).filter(Boolean);

  if (!name) return alert("Rental item name cannot be blank.");

  items[index] = { ...items[index], name, icon, options, active };
  await saveRentalItemsAdmin(items);
}

async function deleteRentalButton(index) {
  const items = normalizeRentalItems(rentalItemsAdminCache.length ? rentalItemsAdminCache : DEFAULT_RENTAL_ITEMS_ADMIN);
  if (!items[index]) return;
  if (!confirm(`Delete rental button "${items[index].name}"?`)) return;
  items.splice(index, 1);
  await saveRentalItemsAdmin(items);
}

async function moveRentalButton(index, direction) {
  const items = normalizeRentalItems(rentalItemsAdminCache.length ? rentalItemsAdminCache : DEFAULT_RENTAL_ITEMS_ADMIN);
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= items.length) return;

  const [moved] = items.splice(index, 1);
  items.splice(newIndex, 0, moved);
  await saveRentalItemsAdmin(items);
}

async function loadRentalsFromGoogleSheetAdmin() {
  const url = getGoogleAppsScriptUrl();
  if (!url) return [];
  try {
    const response = await fetch(url + "?action=rentals&v=" + Date.now(), { cache: "no-store" });
    const data = await response.json();
    return Array.isArray(data.rentals) ? data.rentals : [];
  } catch (error) {
    console.warn("Could not load Rentals tab.", error);
    return [];
  }
}

function rentalStatusClass(status) {
  return String(status || "Active").toLowerCase().replace(/\s+/g, "-") === "not-active" ? "ordered" : "pending";
}

async function renderAdminRentals() {
  const list = document.getElementById("adminRentalsList");
  if (!list) return;

  list.innerHTML = "<p class='admin-note'>Loading active rentals...</p>";
  const rentals = await loadRentalsFromGoogleSheetAdmin();

  if (!rentals.length) {
    list.innerHTML = "<p class='admin-note'>No rentals submitted yet.</p>";
    return;
  }

  list.innerHTML = rentals.map(rental => {
    const status = rental.status || "Active";
    return `
      <div class="admin-order-row">
        <div class="admin-order-head">
          <div>
            <strong>${safeText(rental.job || "Unknown Job")} — ${safeText(rental.rentalItem || "Rental")}${rental.rentalSize ? " - " + safeText(rental.rentalSize) : ""}</strong>
            <span>Requested by ${safeText(rental.requestedBy || "Unknown")} • ${safeText(formatOrderDate(rental.dateAdded))}</span>
          </div>
          <span class="status-badge ${rentalStatusClass(status)}">${safeText(status)}</span>
        </div>

        <div class="admin-order-items">
          <div class="admin-order-line"><span>Size</span><input class="daily-input" type="text" value="${safeText(rental.rentalSize || "")}" data-rental-size="${safeText(rental.id)}" /></div>
          <div class="admin-order-line"><span>Qty</span><input class="daily-input" type="number" min="0" value="${safeText(rental.quantity || 1)}" data-rental-qty="${safeText(rental.id)}" /></div>
          <div class="admin-order-line"><span>Vendor</span><input class="daily-input" type="text" value="${safeText(rental.vendor || "")}" data-rental-vendor="${safeText(rental.id)}" /></div>
          <div class="admin-order-line"><span>Notes</span><input class="daily-input" type="text" value="${safeText(rental.notes || "")}" data-rental-notes="${safeText(rental.id)}" /></div>
          <div class="admin-order-line"><span>Date Off Rent</span><input class="daily-input" type="date" value="${safeText(rental.dateOffRent || "")}" data-rental-off="${safeText(rental.id)}" /></div>
        </div>

        <div class="admin-order-actions">
          <select data-rental-status="${safeText(rental.id)}">
            <option ${status === "Active" ? "selected" : ""}>Active</option>
            <option ${status === "Not Active" ? "selected" : ""}>Not Active</option>
          </select>
          <button class="save-material" data-save-active-rental="${safeText(rental.id)}" type="button">Save Rental</button>
          <button class="delete-material" data-delete-active-rental="${safeText(rental.id)}" type="button">Delete</button>
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll("[data-save-active-rental]").forEach(button => button.addEventListener("click", () => saveActiveRentalAdmin(button.dataset.saveActiveRental)));
  document.querySelectorAll("[data-delete-active-rental]").forEach(button => button.addEventListener("click", () => deleteActiveRentalAdmin(button.dataset.deleteActiveRental)));
}

async function saveActiveRentalAdmin(id) {
  const url = getGoogleAppsScriptUrl();
  if (!url) return alert("Missing Google Apps Script URL.");

  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "updateRental",
      id,
      status: document.querySelector(`[data-rental-status="${CSS.escape(id)}"]`)?.value || "Active",
      rentalSize: document.querySelector(`[data-rental-size="${CSS.escape(id)}"]`)?.value || "",
      quantity: document.querySelector(`[data-rental-qty="${CSS.escape(id)}"]`)?.value || "1",
      vendor: document.querySelector(`[data-rental-vendor="${CSS.escape(id)}"]`)?.value || "",
      notes: document.querySelector(`[data-rental-notes="${CSS.escape(id)}"]`)?.value || "",
      dateOffRent: document.querySelector(`[data-rental-off="${CSS.escape(id)}"]`)?.value || ""
    })
  });

  setTimeout(renderAdminRentals, 600);
}

async function deleteActiveRentalAdmin(id) {
  if (!confirm("Delete this rental?")) return;
  const url = getGoogleAppsScriptUrl();
  if (!url) return alert("Missing Google Apps Script URL.");

  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "deleteRental", id })
  });

  setTimeout(renderAdminRentals, 600);
}

function showRentalsAdminPage() {
  showAdminPage("rentalsPage");
  loadRentalItemsFromGoogleSheetAdmin();
}



/* V81 Admin Manpower */
let adminManpowerEmployees = [];

function normalizeAdminManpowerEmployees(rows) {
  return (rows || []).map(row => ({
    name: row.name || row.Employee || "",
    position: row.position || row.Position || "",
    assignedTo: row.assignedTo || row["Assigned To"] || "Unassigned",
    active: row.active === false ? false : true
  })).filter(row => row.name);
}

async function loadAdminManpowerEmployees() {
  const list = document.getElementById("adminManpowerEmployeeList");
  if (list) list.innerHTML = "<p class='admin-note'>Loading employees...</p>";

  const url = getGoogleAppsScriptUrl();
  if (!url) {
    adminManpowerEmployees = [];
    renderAdminManpowerEmployees();
    return;
  }

  try {
    const response = await fetch(url + "?action=manpowerBoard&v=" + Date.now(), { cache: "no-store" });
    const data = await response.json();
    adminManpowerEmployees = normalizeAdminManpowerEmployees(data.employees || []);
  } catch (error) {
    console.warn("Could not load manpower employees.", error);
    adminManpowerEmployees = [];
  }

  renderAdminManpowerEmployees();
}

function renderAdminManpowerEmployees() {
  const list = document.getElementById("adminManpowerEmployeeList");
  if (!list) return;

  if (!adminManpowerEmployees.length) {
    list.innerHTML = "<p class='admin-note'>No employees added yet.</p>";
    return;
  }

  list.innerHTML = adminManpowerEmployees.map((emp, index) => `
    <div class="material-manager-row editable-material-row">
      <div class="material-edit-grid">
        <label class="admin-label">Employee
          <input value="${safeText(emp.name || "")}" data-admin-mp-name="${index}" />
        </label>
        <label class="admin-label">Position
          <input value="${safeText(emp.position || "")}" data-admin-mp-position="${index}" />
        </label>
        <label class="admin-label" style="grid-column: span 2;">Assigned To
          <select data-admin-mp-assigned="${index}" style="width:100%;min-width:300px;">
            ${["Unassigned","Office","Shop","Vacation", ...(window.jobs||[]).map(j=>j.name).filter(Boolean)].filter((v,i,a)=>a.indexOf(v)===i).map(job=>`<option value="${job}" ${job=== (emp.assignedTo||"Unassigned") ? "selected" : ""}>${job}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="material-edit-actions">
        <button class="save-material" data-save-admin-mp="${index}" type="button">Save</button>
        <button class="delete-material" data-delete-admin-mp="${index}" type="button">Delete</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-save-admin-mp]").forEach(button => button.addEventListener("click", () => saveAdminManpowerEmployee(Number(button.dataset.saveAdminMp))));
  document.querySelectorAll("[data-delete-admin-mp]").forEach(button => button.addEventListener("click", () => deleteAdminManpowerEmployee(Number(button.dataset.deleteAdminMp))));
}

async function saveAdminManpowerToSheet() {
  const url = getGoogleAppsScriptUrl();
  if (!url) return alert("Missing Google Apps Script URL.");

  const jobs = [];
  adminManpowerEmployees.forEach(emp => {
    if (emp.assignedTo && !jobs.some(job => String(job.name).toLowerCase() === String(emp.assignedTo).toLowerCase())) {
      jobs.push({ name: emp.assignedTo, locked: false });
    }
  });

  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "saveManpowerBoard",
      employees: adminManpowerEmployees,
      jobs: jobs
    })
  });
}

async function addAdminManpowerEmployee() {
  const nameEl = document.getElementById("adminManpowerEmployeeName");
  const posEl = document.getElementById("adminManpowerEmployeePosition");
  const name = (nameEl ? nameEl.value : "").trim();
  const position = (posEl ? posEl.value : "").trim();

  if (!name) return alert("Enter employee name.");
  if (adminManpowerEmployees.some(emp => String(emp.name || "").toLowerCase() === name.toLowerCase())) {
    return alert("Employee already exists.");
  }

  adminManpowerEmployees.push({ name, position, assignedTo: "Unassigned", active: true });
  if (nameEl) nameEl.value = "";
  if (posEl) posEl.value = "";

  renderAdminManpowerEmployees();
  await saveAdminManpowerToSheet();
  setTimeout(loadAdminManpowerEmployees, 800);
}

async function saveAdminManpowerEmployee(index) {
  if (!adminManpowerEmployees[index]) return;

  adminManpowerEmployees[index].name = document.querySelector(`[data-admin-mp-name="${index}"]`)?.value.trim() || "";
  adminManpowerEmployees[index].position = document.querySelector(`[data-admin-mp-position="${index}"]`)?.value.trim() || "";
  adminManpowerEmployees[index].assignedTo = document.querySelector(`[data-admin-mp-assigned="${index}"]`)?.value.trim() || "Unassigned";

  adminManpowerEmployees = adminManpowerEmployees.filter(emp => emp.name);
  renderAdminManpowerEmployees();
  await saveAdminManpowerToSheet();
}

async function deleteAdminManpowerEmployee(index) {
  if (!adminManpowerEmployees[index]) return;
  if (!confirm("Delete employee " + adminManpowerEmployees[index].name + "?")) return;
  adminManpowerEmployees.splice(index, 1);
  renderAdminManpowerEmployees();
  await saveAdminManpowerToSheet();
}

function showManpowerAdminPage() {
  showAdminPage("manpowerAdminPage");
  loadAdminManpowerEmployees();
}



/* V93 Role setup */
const ALLOWED_APP_ROLES = ["Admin", "Operations Manager", "Manpower Manager", "User"];

function normalizeUserRole(role) {
  const value = String(role || "User").trim().toLowerCase();
  if (value === "admin") return "Admin";
  if (value === "operations manager" || value === "operations" || value === "operation manager") return "Operations Manager";
  if (value === "manpower manager" || value === "manpower") return "Manpower Manager";
  return "User";
}

function currentUserRole() {
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  return normalizeUserRole(user && user.role);
}

function canManageOrders() {
  const role = currentUserRole();
  return role === "Admin" || role === "Operations Manager";
}

function roleOptionsHtml(selectedRole) {
  const normalized = normalizeUserRole(selectedRole);
  return ALLOWED_APP_ROLES.map(role => `<option value="${role}" ${role === normalized ? "selected" : ""}>${role}</option>`).join("");
}

function setupAdmin() {
  cleanupUnusedAdminPagesV101();
  document.querySelectorAll("[data-admin-page]").forEach(button => {
    button.addEventListener("click", () => {
      showAdminPage(button.dataset.adminPage);
      if (button.dataset.adminPage === "rentalsPage") {
        renderRentalItemsAdmin();
        loadRentalItemsFromGoogleSheetAdmin();
        renderAdminRentals();
      }
      if (button.dataset.adminPage === "manpowerAdminPage") {
        loadAdminManpowerEmployees();
      }
    });
  });

  const openMaterialCard = document.getElementById("openMaterialManagerCard");
  if (openMaterialCard) openMaterialCard.addEventListener("click", showMaterialAdmin);

  document.getElementById("loginBtn").addEventListener("click", login);
  const resetButton = document.getElementById("resetAdminBtn");
  if (resetButton) {
    resetButton.addEventListener("click", resetAdminLogin);
    resetButton.onclick = resetAdminLogin;
  }

  document.getElementById("adminPassword").addEventListener("keydown", event => {
    if (event.key === "Enter") login();
  });

  document.getElementById("addJobBtn").addEventListener("click", addJob);
  document.getElementById("newJobName").addEventListener("keydown", event => {
    if (event.key === "Enter") addJob();
  });

  document.getElementById("resetJobsBtn").addEventListener("click", resetJobs);
  document.getElementById("saveCompanyTitleBtn").addEventListener("click", saveCompanyTitle);
  const saveEmailPdfSettingsBtn = document.getElementById("saveEmailPdfSettingsBtn");
  if (saveEmailPdfSettingsBtn) saveEmailPdfSettingsBtn.addEventListener("click", saveEmailPdfSettings);
  const saveEmailPdfSettingsDashboardBtn = document.getElementById("saveEmailPdfSettingsDashboardBtn");
  if (saveEmailPdfSettingsDashboardBtn) saveEmailPdfSettingsDashboardBtn.addEventListener("click", saveEmailPdfSettings);
  const savePdfLetterheadBtn = document.getElementById("savePdfLetterheadBtn");
  if (savePdfLetterheadBtn) savePdfLetterheadBtn.addEventListener("click", savePdfLetterhead);
  const resetPdfLetterheadBtn = document.getElementById("resetPdfLetterheadBtn");
  if (resetPdfLetterheadBtn) resetPdfLetterheadBtn.addEventListener("click", resetPdfLetterhead);
  document.getElementById("savePasswordBtn").addEventListener("click", savePassword);

  const openMaterialBtn = document.getElementById("openMaterialManagerBtn");
  if (openMaterialBtn) openMaterialBtn.addEventListener("click", showMaterialAdmin);

  const openRentalsBtn = document.getElementById("openRentalsManagerBtn");
  if (openRentalsBtn) openRentalsBtn.addEventListener("click", () => {
    showAdminPage("rentalsPage");
    renderRentalItemsAdmin();
    loadRentalItemsFromGoogleSheetAdmin();
    renderAdminRentals();
  });

  const backToAdminBtn = document.getElementById("backToAdminBtn");
  if (backToAdminBtn) backToAdminBtn.addEventListener("click", showAdminHome);

  const materialCategorySelect = document.getElementById("materialCategorySelect");
  if (materialCategorySelect) materialCategorySelect.addEventListener("change", () => {
    renderMaterialsForAdmin();
    renderMaterialCategoryAdminList();
  });

  const refreshMaterialCategoriesBtn = document.getElementById("refreshMaterialCategoriesBtn");
  if (refreshMaterialCategoriesBtn) refreshMaterialCategoriesBtn.addEventListener("click", () => loadMaterialCategoriesForAdmin());

  const addMaterialCategoryBtn = document.getElementById("addMaterialCategoryBtn");
  if (addMaterialCategoryBtn) addMaterialCategoryBtn.addEventListener("click", () => addMaterialCategory());

  const newMaterialCategoryName = document.getElementById("newMaterialCategoryName");
  if (newMaterialCategoryName) newMaterialCategoryName.addEventListener("keydown", event => {
    if (event.key === "Enter") addMaterialCategory();
  });

  const addMaterialBtn = document.getElementById("addMaterialBtn");
  if (addMaterialBtn) addMaterialBtn.addEventListener("click", () => addMaterial());

  const materialNameInput = document.getElementById("materialNameInput");
  if (materialNameInput) materialNameInput.addEventListener("keydown", event => {
    if (event.key === "Enter") addMaterial();
  });

  const adminAddManpowerEmployeeBtn = document.getElementById("adminAddManpowerEmployeeBtn");
  if (adminAddManpowerEmployeeBtn) adminAddManpowerEmployeeBtn.addEventListener("click", addAdminManpowerEmployee);

  const adminRefreshManpowerBtn = document.getElementById("adminRefreshManpowerBtn");
  if (adminRefreshManpowerBtn) adminRefreshManpowerBtn.addEventListener("click", loadAdminManpowerEmployees);

  const adminManpowerEmployeeName = document.getElementById("adminManpowerEmployeeName");
  if (adminManpowerEmployeeName) adminManpowerEmployeeName.addEventListener("keydown", event => { if (event.key === "Enter") addAdminManpowerEmployee(); });

  const refreshOrdersBtn = document.getElementById("refreshOrdersBtn");
  if (refreshOrdersBtn) refreshOrdersBtn.addEventListener("click", renderAdminOrders);
  var refreshRentalsBtn = document.getElementById("refreshRentalsBtn");
  if (refreshRentalsBtn) refreshRentalsBtn.addEventListener("click", renderAdminRentals);
  var refreshRentalItemsBtn = document.getElementById("refreshRentalItemsBtn");
  if (refreshRentalItemsBtn) refreshRentalItemsBtn.addEventListener("click", loadRentalItemsFromGoogleSheetAdmin);
  var addRentalItemBtn = document.getElementById("addRentalItemBtn");
  if (addRentalItemBtn) addRentalItemBtn.addEventListener("click", addRentalItemAdmin);
  var newRentalItemName = document.getElementById("newRentalItemName");
  if (newRentalItemName) newRentalItemName.addEventListener("keydown", event => { if (event.key === "Enter") addRentalItemAdmin(); });

  var refreshRentalsBtn = document.getElementById("refreshRentalsBtn");
  if (refreshRentalsBtn) refreshRentalsBtn.addEventListener("click", renderAdminRentals);

  var refreshRentalItemsBtn = document.getElementById("refreshRentalItemsBtn");
  if (refreshRentalItemsBtn) refreshRentalItemsBtn.addEventListener("click", loadRentalItemsFromGoogleSheetAdmin);

  var addRentalItemBtn = document.getElementById("addRentalItemBtn");
  if (addRentalItemBtn) addRentalItemBtn.addEventListener("click", addRentalItemAdmin);

  var newRentalItemName = document.getElementById("newRentalItemName");
  if (newRentalItemName) newRentalItemName.addEventListener("keydown", event => { if (event.key === "Enter") addRentalItemAdmin(); });

  window.addEventListener("storage", event => {
    if (event.key === "materialOrderBoardOrders") renderAdminOrders();
  });

  if (sessionStorage.getItem("materialOrderAdmin") === "true") {
    showAdmin();
  }
}

document.addEventListener("DOMContentLoaded", () => { setupAdmin(); cleanupUnusedAdminPagesV101(); });

window.resetAdminLogin = resetAdminLogin;


/* V31 Export / Import App Data */
function exportAppData() {
  const settings = typeof getSettings === "function" ? getSettings() : {};
  const jobs = typeof getJobs === "function" ? getJobs() : [];
  const categories = typeof getCategories === "function" ? getCategories() : {};

  const data = {
    exportedAt: new Date().toISOString(),
    settings,
    jobs,
    categories
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "app-data.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function importAppData(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function() {
    try {
      const data = JSON.parse(reader.result);

      if (data.settings) {
        {
          const existingDirectUrl = getSavedScriptUrl();
          const existingDirectSender = getSavedSenderEmail();
          const importedSettings = data.settings || {};
          if (existingDirectUrl && !importedSettings.googleAppsScriptUrl) importedSettings.googleAppsScriptUrl = existingDirectUrl;
          if (existingDirectSender && !importedSettings.senderEmail) importedSettings.senderEmail = existingDirectSender;
          localStorage.setItem("materialOrderSettings", JSON.stringify(importedSettings));
        }
      }

      if (data.jobs) {
        localStorage.setItem("materialOrderJobs", JSON.stringify(data.jobs));
      }

      if (data.categories) {
        localStorage.setItem("materialOrderCategories", JSON.stringify(data.categories));
      }

      alert("App data imported. The admin page will refresh.");
      location.reload();
    } catch (error) {
      alert("Could not import app data. Make sure it is a valid app-data.json file.");
      console.error(error);
    }
  };

  reader.readAsText(file);
}

function setupExportImportButtons() {
  const exportBtn = document.getElementById("exportAppDataBtn");
  if (exportBtn) exportBtn.addEventListener("click", exportAppData);

  const importInput = document.getElementById("importAppDataInput");
  if (importInput) importInput.addEventListener("change", importAppData);
}

document.addEventListener("DOMContentLoaded", setupExportImportButtons);



async function reloadUploadedAppData() {
  try {
    const response = await fetch(`app-data.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) {
      alert("No app-data.json found in this upload.");
      return;
    }

    const data = await response.json();

    if (data.settings) {
          const existingDirectUrl = getSavedScriptUrl();
          const existingDirectSender = getSavedSenderEmail();
          const importedSettings = data.settings || {};
          if (existingDirectUrl && !importedSettings.googleAppsScriptUrl) importedSettings.googleAppsScriptUrl = existingDirectUrl;
          if (existingDirectSender && !importedSettings.senderEmail) importedSettings.senderEmail = existingDirectSender;
          localStorage.setItem("materialOrderSettings", JSON.stringify(importedSettings));
        }
    if (data.jobs) localStorage.setItem("materialOrderJobs", JSON.stringify(data.jobs));
    if (data.categories && Object.keys(data.categories).length > 0) {
      localStorage.setItem("materialOrderCategories", JSON.stringify(data.categories));
    }

    alert("Uploaded app-data.json loaded.");
    location.reload();
  } catch (error) {
    alert("Could not load uploaded app-data.json.");
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const reloadBtn = document.getElementById("reloadAppDataBtn");
  if (reloadBtn) reloadBtn.addEventListener("click", reloadUploadedAppData);
});



/* V44 Google Sheet Admin Orders */
function getGoogleAppsScriptUrl() {
  const directUrl = getSavedScriptUrl();
  if (directUrl) return directUrl;
  const settings = getSettings();
  return (settings.googleAppsScriptUrl || "").trim();
}

function parseSheetItems(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatSheetDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  } catch {
    return value;
  }
}

function sheetStatusClass(status) {
  return String(status || "Pending").toLowerCase();
}

async function loadAdminSheetOrders() {
  const list = document.getElementById("adminOrdersList");
  if (!list) return;

  list.innerHTML = "<p class='admin-note'>Loading shared orders...</p>";

  try {
    const response = await fetch(getGoogleAppsScriptUrl() + "?v=" + Date.now());
    const data = await response.json();
    const orders = Array.isArray(data.orders) ? data.orders.reverse() : [];

    if (!orders.length) {
      list.innerHTML = "<p class='admin-note'>No orders submitted yet.</p>";
      return;
    }

    list.innerHTML = orders.map(order => {
      const items = parseSheetItems(order.items);
      const itemHtml = items.length ? items.map(item => `
        <div>${safeText(item.name || "Item")} <b>${safeText(item.qty || "")} ${safeText(item.unit || "")}</b></div>
      `).join("") : "<div>No item details found.</div>";

      const status = order.status || "Pending";

      return `
        <div class="admin-order-row">
          <div class="admin-order-head">
            <div>
              <strong>${safeText(order.job || "Unknown Job")}</strong>
              <span>Requested by ${safeText(order.requestedBy || "Unknown")} • ${safeText(formatSheetDate(order.timestamp))}</span>
            </div>
            <span class="status-badge ${sheetStatusClass(status)}">${safeText(status)}</span>
          </div>

          <div class="admin-order-items">
            ${itemHtml}
          </div>

          ${order.notes ? `<p class="admin-order-notes"><b>Notes:</b> ${safeText(order.notes)}</p>` : ""}

          <div class="admin-order-actions">
            <button type="button" class="status-pending" data-sheet-status="Pending" data-sheet-id="${safeText(order.id)}">Pending</button>
            <button type="button" class="status-ordered" data-sheet-status="Ordered" data-sheet-id="${safeText(order.id)}">Ordered</button>
            <button type="button" class="status-delivered" data-sheet-status="Delivered" data-sheet-id="${safeText(order.id)}">Delivered</button>
          </div>
        </div>
      `;
    }).join("");

    document.querySelectorAll("[data-sheet-status]").forEach(button => {
      button.addEventListener("click", () => updateSheetOrderStatus(button.dataset.sheetId, button.dataset.sheetStatus));
    });
  } catch (error) {
    console.error(error);
    list.innerHTML = "<p class='admin-error'>Could not load shared orders. Check Google Apps Script permissions.</p>";
  }
}

async function updateSheetOrderStatus(id, status) {
  try {
    await fetch(getGoogleAppsScriptUrl(), {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "updateStatus",
        id,
        status
      })
    });

    setTimeout(loadAdminSheetOrders, 800);
  } catch (error) {
    console.error(error);
    alert("Could not update order status.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const refreshBtn = document.getElementById("refreshOrdersBtn");
  if (refreshBtn) refreshBtn.addEventListener("click", loadAdminSheetOrders);
  setTimeout(loadAdminSheetOrders, 500);
});

/* V70 Google Sheets jobs manager - no app-data export needed for jobs */
const DEFAULT_GOOGLE_APPS_SCRIPT_URL = "";

function getGoogleAppsScriptUrl() {
  const directUrl = getSavedScriptUrl();
  if (directUrl) return directUrl;
  const settings = getSettings();
  return (settings.googleAppsScriptUrl || "").trim();
}

async function loadJobsFromGoogleSheetAdmin() {
  const url = getGoogleAppsScriptUrl();
  if (!url) return false;
  try {
    const response = await fetch(url + "?action=jobs&v=" + Date.now(), { cache: "no-store" });
    const data = await response.json();
    if (Array.isArray(data.jobs)) {
      localStorage.setItem("materialOrderJobs", JSON.stringify(data.jobs));
      if (typeof renderJobs === "function") renderJobs();
      return true;
    }
  } catch (error) {
    console.warn("Could not load Jobs tab from Google Sheet.", error);
  }
  return false;
}

async function syncJobsToGoogleSheet(jobs) {
  const url = getGoogleAppsScriptUrl();
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "saveJobs", jobs: jobs })
    });
  } catch (error) {
    console.warn("Could not sync jobs to Google Sheet.", error);
  }
}

function saveJobs(jobs) {
  setJSON("materialOrderJobs", jobs);
  syncJobsToGoogleSheet(jobs);
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(loadJobsFromGoogleSheetAdmin, 500);
  setTimeout(loadMaterialsFromGoogleSheetAdmin, 700);
  setTimeout(loadRentalItemsFromGoogleSheetAdmin, 900);
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
function isAdminUser(user) { const role = normalizeUserRole(user && user.role); return role === "Admin" || role === "Operations Manager"; }
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
  const input = document.getElementById("requestedBy");
  if (user && input) {
    input.value = user.displayName || user.username || "";
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


/* V80 Admin Users manager */
function setupAdminLoginFields() {
  const passwordInput = document.getElementById("adminPassword");
  if (!passwordInput || document.getElementById("adminUsername")) return;
  const label = passwordInput.closest("label");
  if (label) {
    label.insertAdjacentHTML("beforebegin", `<label class="admin-label">Username<input id="adminUsername" type="text" placeholder="Enter username" autocomplete="username" /></label>`);
    label.childNodes[0].textContent = "Password ";
  }
}
function ensureUsersAdminPage() {
  const nav = document.querySelector(".admin-nav");
  if (nav && !nav.querySelector('[data-admin-page="usersPage"]')) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.adminPage = "usersPage";
    btn.textContent = "Users";
    btn.addEventListener("click", () => showAdminPage("usersPage"));
    nav.appendChild(btn);
  }
  const grid = document.querySelector(".admin-dashboard-grid");
  if (grid && !grid.querySelector('[data-admin-page="usersPage"]')) {
    grid.insertAdjacentHTML("beforeend", `<button class="admin-menu-card" type="button" data-admin-page="usersPage"><span>👥</span><strong>Users</strong><small>Add users, reset passwords, and set admin access</small></button>`);
  }
  const main = document.querySelector(".admin-main");
  if (main && !document.getElementById("usersPage")) {
    main.insertAdjacentHTML("beforeend", `
      <section id="usersPage" class="admin-page">
        <div class="admin-page-head"><div><p class="small-text">Admin Panel</p><h1>Users</h1></div><button class="admin-link-button" type="button" data-admin-page="adminDashboardPage">Back</button></div>
        <div class="admin-card admin-wide-card">
          <h2>User Accounts</h2>
          <p class="admin-note left-note">Users are saved in the Google Sheet <strong>Users</strong> tab. Role controls who can access the admin panel.</p>
          <div class="admin-users-actions">
            <button id="loadUsersBtn" class="primary-btn" type="button">Refresh Users</button>
            <button id="addUserRowBtn" class="admin-reset-btn" type="button">Add User</button>
            <button id="saveUsersBtn" class="primary-btn" type="button">Save Users</button>
          </div>
          <div id="usersManagerList"></div>
          <p id="usersMessage" class="admin-message"></p>
        </div>
      </section>`);
  }
  document.querySelectorAll('[data-admin-page="usersPage"]').forEach(el => {
    el.addEventListener("click", () => { showAdminPage("usersPage"); loadUsersManager(); });
  });
  const loadBtn = document.getElementById("loadUsersBtn");
  if (loadBtn) loadBtn.addEventListener("click", loadUsersManager);
  const addBtn = document.getElementById("addUserRowBtn");
  if (addBtn) addBtn.addEventListener("click", () => addUserRow({ username:"", password:"Temp123", role:"User", email:"", active:true, mustChangePassword:true, displayName:"" }));
  const saveBtn = document.getElementById("saveUsersBtn");
  if (saveBtn) saveBtn.addEventListener("click", saveUsersManager);
}
async function loadUsersManager() {
  const list = document.getElementById("usersManagerList");
  const msg = document.getElementById("usersMessage");
  if (!list) return;
  list.innerHTML = "<p class='admin-note left-note'>Loading users...</p>";
  try {
    const response = await fetch(getGoogleAppsScriptUrl() + "?action=users&v=" + Date.now(), { cache: "no-store" });
    const data = await response.json();
    const users = Array.isArray(data.users) ? data.users : [];
    renderUsersTable(users);
    if (msg) msg.textContent = "";
  } catch (err) {
    list.innerHTML = "<p class='admin-error'>Could not load users. Check Google Apps Script deployment.</p>";
  }
}
function renderUsersTable(users) {
  const list = document.getElementById("usersManagerList");
  list.innerHTML = `<div style="overflow:auto"><table class="admin-users-table"><thead><tr><th>Username</th><th>Display Name</th><th>Password / Reset</th><th>Role</th><th>Email</th><th>Active</th><th>Force Change</th><th></th></tr></thead><tbody id="usersTableBody"></tbody></table></div>`;
  users.forEach(addUserRow);
}
function addUserRow(user) {
  const body = document.getElementById("usersTableBody");
  if (!body) { renderUsersTable([user]); return; }
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input class="u-username" value="${safeText(user.username || "")}" placeholder="username"></td>
    <td><input class="u-display" value="${safeText(user.displayName || "")}" placeholder="Name"></td>
    <td><input class="u-password" value="${safeText(user.password || "")}" placeholder="Temp123"></td>
    <td><select class="u-role">${roleOptionsHtml(user.role)}</select></td>
    <td><input class="u-email" value="${safeText(user.email || "")}" placeholder="email"></td>
    <td><select class="u-active"><option value="true">Yes</option><option value="false">No</option></select></td>
    <td><select class="u-must"><option value="false">No</option><option value="true">Yes</option></select></td>
    <td><button class="admin-danger-small u-delete" type="button">Delete</button></td>`;
  body.appendChild(tr);
  tr.querySelector(".u-role").value = normalizeUserRole(user.role);
  tr.querySelector(".u-active").value = user.active === false ? "false" : "true";
  tr.querySelector(".u-must").value = user.mustChangePassword ? "true" : "false";
  tr.querySelector(".u-delete").addEventListener("click", () => tr.remove());
}
function collectUsersRows() {
  return Array.from(document.querySelectorAll("#usersTableBody tr")).map(tr => ({
    username: tr.querySelector(".u-username").value.trim(),
    displayName: tr.querySelector(".u-display").value.trim(),
    password: tr.querySelector(".u-password").value,
    role: normalizeUserRole(tr.querySelector(".u-role").value),
    email: tr.querySelector(".u-email").value.trim(),
    active: tr.querySelector(".u-active").value === "true",
    mustChangePassword: tr.querySelector(".u-must").value === "true"
  })).filter(u => u.username);
}
async function saveUsersManager() {
  const msg = document.getElementById("usersMessage");
  const users = collectUsersRows();
  if (!users.length) { if (msg) msg.textContent = "Add at least one user."; return; }
  try {
    await fetch(getGoogleAppsScriptUrl(), { method:"POST", mode:"no-cors", headers:{"Content-Type":"text/plain;charset=utf-8"}, body: JSON.stringify({ action:"saveUsers", users }) });
    if (msg) { msg.style.color = "#22c55e"; msg.textContent = "Users saved to Google Sheet."; }
  } catch (err) {
    if (msg) { msg.style.color = "#fca5a5"; msg.textContent = "Could not save users."; }
  }
}
function afterLoginRefresh() {
  if (typeof loadJobsFromGoogleSheetAdmin === "function") loadJobsFromGoogleSheetAdmin();
  loadUsersManager();
}
document.addEventListener("DOMContentLoaded", () => {
  setupAdminLoginFields();
  ensureUsersAdminPage();
  const user = getCurrentUser();
  if (user && isAdminUser(user)) {
    document.body.classList.remove("auth-locked");
    document.getElementById("loginScreen").classList.add("hidden-admin");
    showAdmin();
    addUserPill();
  } else {
    document.body.classList.remove("auth-locked");
  }
});

/* V58 hard fix: save Google Apps Script URL independently from all other settings */
function readV58EmailPdfInputs() {
  const ids = ["googleAppsScriptUrlInputDashboard", "googleAppsScriptUrlInput", "googleAppsScriptUrlInputAppSettings"];
  let url = "";
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el && String(el.value || "").trim()) { url = String(el.value).trim(); break; }
  }
  const senderIds = ["senderEmailInputDashboard", "senderEmailInput", "senderEmailInputAppSettings"];
  let senderEmail = "";
  for (const id of senderIds) {
    const el = document.getElementById(id);
    if (el && String(el.value || "").trim()) { senderEmail = String(el.value).trim(); break; }
  }
  return { googleAppsScriptUrl: url, senderEmail };
}

function fillV58EmailPdfInputs(url, senderEmail) {
  ["googleAppsScriptUrlInputDashboard", "googleAppsScriptUrlInput", "googleAppsScriptUrlInputAppSettings"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = url || "";
  });
  ["senderEmailInputDashboard", "senderEmailInput", "senderEmailInputAppSettings"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = senderEmail || "";
  });
}

async function saveEmailPdfSettings() {
  const data = readV58EmailPdfInputs();
  const url = data.googleAppsScriptUrl;
  const senderEmail = data.senderEmail || "";
  if (!url) { alert("Paste your Google Apps Script Web App URL ending in /exec first."); return; }
  if (!url.includes("script.google.com/macros/s/") || !url.endsWith("/exec")) {
    alert("That does not look like a valid Google Apps Script Web App URL. It should end with /exec.");
    return;
  }

  localStorage.setItem("materialOrderGoogleAppsScriptUrl", url);
  localStorage.setItem("materialOrderSenderEmail", senderEmail);

  let settings = {};
  try { settings = JSON.parse(localStorage.getItem("materialOrderSettings") || "{}"); } catch { settings = {}; }
  settings.googleAppsScriptUrl = url;
  settings.senderEmail = senderEmail;
  localStorage.setItem("materialOrderSettings", JSON.stringify(settings));
  fillV58EmailPdfInputs(url, senderEmail);

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "saveSettings", settings: { googleAppsScriptUrl: url, senderEmail: senderEmail } })
    });
  } catch (err) {
    console.warn("Settings saved locally, but Google Settings tab save was not confirmed.", err);
  }

  alert("Saved. The URL is saved in this browser. It was also sent to the Google Sheet Settings tab if the script supports it.");
}

(function attachV58EmailSettingsFix(){
  document.addEventListener("DOMContentLoaded", function(){
    const savedUrl = localStorage.getItem("materialOrderGoogleAppsScriptUrl") || "";
    const savedSender = localStorage.getItem("materialOrderSenderEmail") || "";
    if (savedUrl || savedSender) fillV58EmailPdfInputs(savedUrl, savedSender);
    ["saveEmailPdfSettingsBtn", "saveEmailPdfSettingsDashboardBtn"].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.onclick = saveEmailPdfSettings;
    });
  });
})();


/* V107 expose material category functions for Admin buttons */
window.refreshMaterialCategorySelectAdmin = refreshMaterialCategorySelectAdmin;
window.addMaterialCategory = addMaterialCategory;

window.loadMaterialCategoriesForAdmin = loadMaterialCategoriesForAdmin;
window.refreshMaterialCategorySelectAdmin = refreshMaterialCategorySelectAdmin;


/* V116 clean material admin manager */
let materialAdminCategoryRowsV116 = [];

async function fetchMaterialCategoriesRowsV116() {
  const url = getGoogleAppsScriptUrl();
  if (!url) throw new Error("Google Apps Script URL is missing.");
  const res = await fetch(url + "?action=materialCategories&v=" + Date.now(), { cache: "no-store" });
  const data = await res.json();
  if (!data || data.success === false) throw new Error("MaterialCategories endpoint failed.");
  return normalizeMaterialCategoryRowsV116(data.materialCategories || []);
}

async function fetchMaterialsRowsV116() {
  const url = getGoogleAppsScriptUrl();
  if (!url) throw new Error("Google Apps Script URL is missing.");
  const res = await fetch(url + "?action=materials&v=" + Date.now(), { cache: "no-store" });
  const data = await res.json();
  if (!data || data.success === false) throw new Error("Materials endpoint failed.");
  return data.materials || [];
}

async function saveMaterialCategoriesRowsV116(categoriesObject) {
  const url = getGoogleAppsScriptUrl();
  if (!url) throw new Error("Google Apps Script URL is missing.");

  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "saveMaterialCategories",
      materialCategories: categoriesToMaterialCategoryRows(categoriesObject)
    })
  });
}

async function saveMaterialsRowsV116(categoriesObject) {
  const url = getGoogleAppsScriptUrl();
  if (!url) throw new Error("Google Apps Script URL is missing.");

  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "saveMaterials",
      materials: categoriesToMaterialRows(categoriesObject)
    })
  });
}

async function loadMaterialCategoriesForAdmin() {
  const list = document.getElementById("materialCategoriesAdminList");
  const select = document.getElementById("materialCategorySelect");
  if (list) list.innerHTML = "<p class='admin-note'>Loading categories...</p>";
  if (select) select.innerHTML = '<option value="">Loading categories...</option>';

  try {
    materialAdminCategoryRowsV116 = await fetchMaterialCategoriesRowsV116();
    const materialRows = await fetchMaterialsRowsV116();

    const categoryShell = {};
    materialAdminCategoryRowsV116.forEach(cat => {
      categoryShell[cat.category] = { label: cat.categoryLabel || cat.category, items: [] };
    });

    const built = materialRowsToCategories(materialRows, materialAdminCategoryRowsV116.map(cat => ({
      category: cat.category,
      categoryLabel: cat.categoryLabel,
      active: true,
      sortOrder: cat.sortOrder
    }))) || categoryShell;

    Object.keys(categoryShell).forEach(key => {
      categoryShell[key].items = built[key] && Array.isArray(built[key].items) ? built[key].items : [];
    });

    localStorage.setItem("materialOrderCategories", JSON.stringify(categoryShell));
    renderMaterialCategoryDropdownV116();
    renderMaterialCategoryAdminListV116();
    renderMaterialsForAdmin();

    if (!materialAdminCategoryRowsV116.length && list) {
      list.innerHTML = "<p class='admin-note'>No categories found in MaterialCategories.</p>";
    }
  } catch (err) {
    console.error(err);
    if (list) list.innerHTML = "<p class='admin-error'>Could not load categories from MaterialCategories.</p>";
    if (select) select.innerHTML = '<option value="">Could not load categories</option>';
  }
}

function renderMaterialCategoryDropdownV116(preferredKey) {
  const select = document.getElementById("materialCategorySelect");
  if (!select) return;
  const old = preferredKey || select.value || (materialAdminCategoryRowsV116[0] && materialAdminCategoryRowsV116[0].category) || "";
  select.innerHTML = materialAdminCategoryRowsV116.map(cat =>
    `<option value="${safeText(cat.category)}">${safeText(cat.categoryLabel || cat.category)}</option>`
  ).join("");

  if (old && materialAdminCategoryRowsV116.some(cat => cat.category === old)) {
    select.value = old;
  } else if (materialAdminCategoryRowsV116.length) {
    select.value = materialAdminCategoryRowsV116[0].category;
  }
}

function renderMaterialCategoryAdminListV116() {
  const list = document.getElementById("materialCategoriesAdminList");
  if (!list) return;
  if (!materialAdminCategoryRowsV116.length) {
    list.innerHTML = "<p class='admin-note'>No categories found.</p>";
    return;
  }
  const selected = document.getElementById("materialCategorySelect")?.value || "";
  list.innerHTML = materialAdminCategoryRowsV116.map(cat => `
    <button type="button" class="material-category-admin-row ${selected === cat.category ? "active" : ""}" data-v116-category="${safeText(cat.category)}">
      <strong>${safeText(cat.categoryLabel || cat.category)}</strong>
      <span>${safeText(cat.category)}</span>
    </button>
  `).join("");

  document.querySelectorAll("[data-v116-category]").forEach(btn => {
    btn.addEventListener("click", () => {
      const select = document.getElementById("materialCategorySelect");
      if (select) {
        select.value = btn.dataset.v116Category;
        renderMaterialsForAdmin();
        renderMaterialCategoryAdminListV116();
      }
    });
  });
}

function renderMaterialCategorySelect(preferredKey) {
  renderMaterialCategoryDropdownV116(preferredKey);
  renderMaterialCategoryAdminListV116();
}

function renderMaterialCategoryDropdown(preferredKey) {
  renderMaterialCategoryDropdownV116(preferredKey);
  renderMaterialCategoryAdminListV116();
}

function renderMaterialCategoryAdminList() {
  renderMaterialCategoryAdminListV116();
}

async function refreshMaterialCategorySelectAdmin(preferredKey) {
  await loadMaterialCategoriesForAdmin();
  if (preferredKey) renderMaterialCategorySelect(preferredKey);
}

async function addMaterialCategory() {
  const nameEl = document.getElementById("newMaterialCategoryName");
  const keyEl = document.getElementById("newMaterialCategoryKey");
  const label = nameEl ? nameEl.value.trim() : "";
  const requestedKey = keyEl ? keyEl.value.trim() : "";
  const key = slugifyMaterialCategoryKey(requestedKey || label);

  if (!label) return alert("Enter a category name.");
  if (!key) return alert("Could not create a category key. Try a different name.");

  const url = getGoogleAppsScriptUrl();
  if (!url) return alert("Google Apps Script URL is missing. Check App Settings.");

  const categories = getCategories();
  if (categories[key]) return alert("That category already exists.");

  // Show it immediately in the app.
  categories[key] = { label, items: [] };
  localStorage.setItem("materialOrderCategories", JSON.stringify(categories));

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "addMaterialCategory",
        category: key,
        categoryLabel: label,
        active: true,
        sortOrder: Object.keys(categories).length
      })
    });
  } catch (err) {
    console.error(err);
    alert("Could not save category to Excel. Check Apps Script addMaterialCategory.");
    return;
  }

  if (nameEl) nameEl.value = "";
  if (keyEl) keyEl.value = "";

  // Reload from sheet after the no-cors POST has time to complete.
  setTimeout(async () => {
    await loadMaterialCategoriesForAdmin();
    const select = document.getElementById("materialCategorySelect");
    if (select) select.value = key;
    renderMaterialsForAdmin();
    renderMaterialCategoryAdminListV116();
  }, 1000);

  alert("Category added. It may take a second to show in the Excel sheet.");
}

async function addMaterial() {
  const select = document.getElementById("materialCategorySelect");
  const categoryKey = select ? select.value : "";
  const name = document.getElementById("materialNameInput").value.trim();
  const icon = document.getElementById("materialIconInput").value.trim() || "•";
  const options = parseCsvList(document.getElementById("materialOptionsInput").value);
  const units = parseCsvList(document.getElementById("materialUnitsInput").value);

  if (!categoryKey) return alert("Select a category.");
  if (!name) return alert("Enter a material name.");

  const categories = getCategories();
  if (!categories[categoryKey]) {
    const found = materialAdminCategoryRowsV116.find(cat => cat.category === categoryKey);
    categories[categoryKey] = { label: found ? found.categoryLabel : categoryKey, items: [] };
  }

  if (categories[categoryKey].items.some(item => String(item.name || "").toLowerCase() === name.toLowerCase())) {
    return alert("That material already exists.");
  }

  const newItem = { icon, name, units: units.length ? units : ["Each"] };
  if (options.length) newItem.options = options;
  categories[categoryKey].items.push(newItem);

  const cleaned = dedupeCategoryItems(categories);
  localStorage.setItem("materialOrderCategories", JSON.stringify(cleaned));

  try {
    await saveMaterialsRowsV116(cleaned);
  } catch (err) {
    console.error(err);
    alert("Could not save material to Excel. Check Apps Script saveMaterials.");
    return;
  }

  document.getElementById("materialNameInput").value = "";
  document.getElementById("materialIconInput").value = "";
  document.getElementById("materialOptionsInput").value = "";
  document.getElementById("materialUnitsInput").value = "";

  await loadMaterialCategoriesForAdmin();
  const s = document.getElementById("materialCategorySelect");
  if (s) s.value = categoryKey;
  renderMaterialsForAdmin();
  renderMaterialCategoryAdminListV116();
  alert("Material added.");
}

function showMaterialAdmin() {
  document.getElementById("adminScreen").classList.add("hidden-admin");
  document.getElementById("materialAdminScreen").classList.remove("hidden-admin");
  loadMaterialCategoriesForAdmin();
  setTimeout(wireMaterialAdminV116, 300);
}

function wireMaterialAdminV116() {
  const select = document.getElementById("materialCategorySelect");
  if (select && !select.dataset.v116) {
    select.dataset.v116 = "true";
    select.addEventListener("change", () => {
      renderMaterialsForAdmin();
      renderMaterialCategoryAdminListV116();
    });
  }

  const refresh = document.getElementById("refreshMaterialCategoriesBtn");
  if (refresh && !refresh.dataset.v116) {
    refresh.dataset.v116 = "true";
    refresh.addEventListener("click", () => loadMaterialCategoriesForAdmin());
  }

  const addCat = document.getElementById("addMaterialCategoryBtn");
  if (addCat && !addCat.dataset.v116) {
    addCat.dataset.v116 = "true";
    addCat.addEventListener("click", () => addMaterialCategory());
  }

  const addMat = document.getElementById("addMaterialBtn");
  if (addMat && !addMat.dataset.v116) {
    addMat.dataset.v116 = "true";
    addMat.addEventListener("click", () => addMaterial());
  }
}

document.addEventListener("DOMContentLoaded", () => setTimeout(wireMaterialAdminV116, 500));
window.loadMaterialCategoriesForAdmin = loadMaterialCategoriesForAdmin;


/* V110 hotfix: make sidebar Materials and Add Rental reliable even if older listeners miss */
document.addEventListener("click", function(event) {
  const materialBtn = event.target.closest && event.target.closest("#openMaterialManagerBtn");
  if (materialBtn) {
    event.preventDefault();
    if (typeof showMaterialAdmin === "function") showMaterialAdmin();
    return;
  }
});

/* V117 hotfix: make Add Rental Button work reliably */
window.addRentalItemAdmin = addRentalItemAdmin;
window.saveRentalItemsAdmin = saveRentalItemsAdmin;
window.loadRentalItemsFromGoogleSheetAdmin = loadRentalItemsFromGoogleSheetAdmin;

document.addEventListener("click", function(event) {
  const addRentalBtn = event.target.closest && event.target.closest("#addRentalItemBtn");
  if (!addRentalBtn) return;
  event.preventDefault();
  event.stopPropagation();
  if (typeof addRentalItemAdmin === "function") {
    addRentalItemAdmin();
  }
}, true);

document.addEventListener("keydown", function(event) {
  if (event.key !== "Enter") return;
  const target = event.target;
  if (!target || !["newRentalItemName", "newRentalItemIcon", "newRentalItemSizes"].includes(target.id)) return;
  event.preventDefault();
  if (typeof addRentalItemAdmin === "function") addRentalItemAdmin();
}, true);


/* Estimating bid email page */
function getEstimatingRecipients() {
  const settings = getSettings();
  if (Array.isArray(settings.estimatingRecipients)) return settings.estimatingRecipients;
  if (typeof settings.estimatingRecipients === "string") {
    try { return JSON.parse(settings.estimatingRecipients); } catch (err) { return []; }
  }
  return [];
}
async function loadEstimatingRecipientsFromSheet() {
  const url = getGoogleAppsScriptUrl();
  if (!url) return;
  try {
    const response = await fetch(url + "?action=estimatingRecipients&v=" + Date.now(), { cache: "no-store" });
    const data = await response.json();
    if (data && Array.isArray(data.estimatingRecipients)) {
      const settings = getSettings();
      settings.estimatingRecipients = data.estimatingRecipients.map(r => ({ name: r.name || r.email || "", email: r.email || "" })).filter(r => r.email);
      saveSettings(settings);
    }
  } catch (err) { console.warn("Could not load estimating recipients from sheet", err); }
}
async function saveEstimatingRecipientsToSheet(recipients) {
  const url = getGoogleAppsScriptUrl();
  if (!url) return;
  try {
    await fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: "saveEstimatingRecipients", recipients: recipients || [] }) });
  } catch (err) { console.warn("Could not save estimating recipients to sheet", err); }
}
function saveEstimatingSettings(partial) {
  const settings = getSettings();
  const merged = Object.assign({}, settings, partial || {});
  saveSettings(merged);
  const url = getGoogleAppsScriptUrl();
  if (url) {
    try {
      fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: "saveSettings", settings: { estimatingToEmail: merged.estimatingToEmail || "", estimatingCcEmail: merged.estimatingCcEmail || "", estimatingSenderName: merged.estimatingSenderName || DEFAULT_SETTINGS.estimatingSenderName, estimatingEmailHeading: merged.estimatingEmailHeading || DEFAULT_SETTINGS.estimatingEmailHeading, estimatingQuoteContact: merged.estimatingQuoteContact || "" } }) });
    } catch (err) { console.warn("Could not sync estimating settings", err); }
  }
}
function selectedEstimatingBcc() {
  return Array.from(document.querySelectorAll("[data-estimating-bcc]:checked")).map(cb => cb.value).filter(Boolean);
}
function renderEstimatingRecipients() {
  const list = document.getElementById("estimatingRecipientList");
  if (!list) return;
  const recipients = getEstimatingRecipients();
  if (!recipients.length) {
    list.innerHTML = "<p class='admin-note left-note'>No saved recipients yet.</p>";
    return;
  }
  list.innerHTML = recipients.map((r, i) => `
    <div class="estimating-recipient-row">
      <label><input type="checkbox" data-estimating-bcc value="${safeText(r.email)}" /> <strong>${safeText(r.name || r.email)}</strong><span>${safeText(r.email)}</span></label>
      <button type="button" class="delete-material" data-delete-estimating-recipient="${i}">Delete</button>
    </div>`).join("");
  list.querySelectorAll("[data-estimating-bcc]").forEach(cb => cb.addEventListener("change", updateEstimatingPreview));
  list.querySelectorAll("[data-delete-estimating-recipient]").forEach(btn => btn.addEventListener("click", () => deleteEstimatingRecipient(Number(btn.dataset.deleteEstimatingRecipient))));
}
function addEstimatingRecipient() {
  const nameEl = document.getElementById("estimatingRecipientNameInput");
  const emailEl = document.getElementById("estimatingRecipientEmailInput");
  const name = (nameEl?.value || "").trim();
  const email = (emailEl?.value || "").trim();
  if (!email) return alert("Enter an email address.");
  const recipients = getEstimatingRecipients().filter(r => String(r.email || "").toLowerCase() !== email.toLowerCase());
  recipients.push({ name: name || email, email });
  saveEstimatingSettings({ estimatingRecipients: recipients });
  saveEstimatingRecipientsToSheet(recipients);
  if (nameEl) nameEl.value = "";
  if (emailEl) emailEl.value = "";
  renderEstimatingRecipients();
  updateEstimatingPreview();
}
function deleteEstimatingRecipient(index) {
  const recipients = getEstimatingRecipients();
  recipients.splice(index, 1);
  saveEstimatingSettings({ estimatingRecipients: recipients });
  saveEstimatingRecipientsToSheet(recipients);
  renderEstimatingRecipients();
  updateEstimatingPreview();
}
function getEstimatingFormData() {
  const settings = getSettings();
  const jobName = (document.getElementById("estimatingJobNameInput")?.value || "").trim();
  const bidDate = (document.getElementById("estimatingBidDateInput")?.value || "").trim();
  const downloadLink = (document.getElementById("estimatingDownloadLinkInput")?.value || "").trim();
  const toEmail = (document.getElementById("estimatingToInput")?.value || settings.estimatingToEmail || "").trim();
  const fromEmail = (document.getElementById("estimatingFromEmailInput")?.value || settings.senderEmail || "").trim();
  const senderName = (document.getElementById("estimatingSenderNameInput")?.value || settings.estimatingSenderName || DEFAULT_SETTINGS.estimatingSenderName).trim();
  const cc = (document.getElementById("estimatingCcInput")?.value || "").trim();
  const heading = (document.getElementById("estimatingHeadingInput")?.value || settings.estimatingEmailHeading || DEFAULT_SETTINGS.estimatingEmailHeading).trim();
  const quoteContact = (document.getElementById("estimatingQuoteContactInput")?.value || DEFAULT_SETTINGS.estimatingQuoteContact).trim();
  return { jobName, bidDate, downloadLink, toEmail, fromEmail, senderName, cc, bcc: selectedEstimatingBcc(), heading, quoteContact };
}
function buildEstimatingSubject(data) {
  return `Bid Request - ${data.jobName || "Project"}${data.bidDate ? " - Bid Date " + data.bidDate : ""}`;
}
function buildEstimatingPlainBody(data) {
  return `${data.heading || "AC General BID Opportunity"}\n\n${data.jobName || "[JOB NAME]"}\n${data.bidDate || "[BID DATE]"}\n\nPlease click here to download the file for the job referenced above:\n${data.downloadLink || "[DOWNLOAD LINK]"}\n\nPlease send your quotes to:\n${data.quoteContact || "Nicholas Mcdonald – nmcdonald@acgeneral.net"}`;
}
function buildEstimatingHtmlBody(data) {
  const link = data.downloadLink || "#";
  return `<div style="font-family:Arial,sans-serif;max-width:720px;color:#111827;line-height:1.45;">
    <div style="font-size:14px;letter-spacing:.08em;text-transform:uppercase;font-weight:800;color:#f97316;margin-bottom:8px;">${safeText(data.heading || "AC General BID Opportunity")}</div>
    <h2 style="margin:0 0 8px;color:#0f172a;">${safeText(data.jobName || "[JOB NAME]")}</h2>
    <p style="margin:0 0 18px;"><strong>Bid Date:</strong> ${safeText(data.bidDate || "[BID DATE]")}</p>
    <p>Please click the button below to download the files for the job referenced above.</p>
    <p style="margin:22px 0;"><a href="${safeText(link)}" style="background:#f97316;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:bold;display:inline-block;">Click Here To Download</a></p>
    <p style="font-size:13px;color:#475569;">If the button does not open, copy and paste this link into your browser:<br>${safeText(data.downloadLink || "")}</p>
    <hr style="border:0;border-top:1px solid #e5e7eb;margin:20px 0;" />
    <p><strong>Please send your quotes to:</strong><br>${safeText(data.quoteContact || "Nicholas Mcdonald – nmcdonald@acgeneral.net")}</p>
  </div>`;
}
function updateEstimatingPreview() {
  const data = getEstimatingFormData();
  const preview = document.getElementById("estimatingEmailPreview");
  if (preview) preview.innerHTML = buildEstimatingHtmlBody(data) + `<p><strong>To:</strong> ${safeText(data.toEmail || "None")}</p><p><strong>CC:</strong> ${safeText(data.cc || "None")}</p><p><strong>BCC:</strong> ${safeText(data.bcc.join(", ") || "None selected")}</p>`;
  saveEstimatingSettings({ estimatingToEmail: data.toEmail, estimatingCcEmail: data.cc, estimatingSenderName: data.senderName, estimatingEmailHeading: data.heading, estimatingQuoteContact: data.quoteContact, senderEmail: data.fromEmail || getSettings().senderEmail });
}
function openEstimatingEmailApp() {
  const data = getEstimatingFormData();
  if (!data.jobName || !data.bidDate || !data.downloadLink) return alert("Enter the job name, bid date, and download link first.");
  updateEstimatingPreview();
  // Build the mailto manually. URLSearchParams turns spaces into + signs,
  // and some email apps show those plus signs instead of converting them back.
  const parts = [];
  parts.push("subject=" + encodeURIComponent(buildEstimatingSubject(data)));
  parts.push("body=" + encodeURIComponent(buildEstimatingPlainBody(data)));
  if (data.cc) parts.push("cc=" + encodeURIComponent(data.cc));
  if (data.bcc.length) parts.push("bcc=" + encodeURIComponent(data.bcc.join(",")));
  window.location.href = "mailto:" + encodeURIComponent(data.toEmail || "") + "?" + parts.join("&");
}
async function sendEstimatingEmailFromApp() {
  const data = getEstimatingFormData();
  if (!data.jobName || !data.bidDate || !data.downloadLink) return alert("Enter the job name, bid date, and download link first.");
  if (!data.toEmail && !data.bcc.length) return alert("Enter a Send To email or select at least one BCC recipient.");
  const url = getGoogleAppsScriptUrl();
  if (!url) return alert("Missing Google Apps Script URL in App Settings.");
  updateEstimatingPreview();
  const msg = document.getElementById("estimatingMessage");
  if (msg) msg.textContent = "Sending estimating email...";
  await fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: "estimatingEmail", jobName: data.jobName, bidDate: data.bidDate, downloadLink: data.downloadLink, toEmail: data.toEmail, fromEmail: data.fromEmail, cc: data.cc, bcc: data.bcc.join(","), senderName: data.senderName, heading: data.heading, quoteContact: data.quoteContact }) });
  if (msg) msg.textContent = "Estimating email sent/requested.";
}
async function setupEstimatingPage() {
  await loadEstimatingRecipientsFromSheet();
  renderEstimatingRecipients();
  loadSettingsForm();
  ["estimatingJobNameInput","estimatingBidDateInput","estimatingDownloadLinkInput","estimatingToInput","estimatingFromEmailInput","estimatingSenderNameInput","estimatingCcInput","estimatingHeadingInput","estimatingQuoteContactInput"].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.dataset.estimatingWired) { el.dataset.estimatingWired = "true"; el.addEventListener("input", updateEstimatingPreview); }
  });
  const addBtn = document.getElementById("addEstimatingRecipientBtn");
  if (addBtn && !addBtn.dataset.estimatingWired) { addBtn.dataset.estimatingWired = "true"; addBtn.addEventListener("click", addEstimatingRecipient); }
  const openBtn = document.getElementById("openEstimatingEmailBtn");
  if (openBtn && !openBtn.dataset.estimatingWired) { openBtn.dataset.estimatingWired = "true"; openBtn.addEventListener("click", openEstimatingEmailApp); }
  const sendBtn = document.getElementById("sendEstimatingEmailBtn");
  if (sendBtn && !sendBtn.dataset.estimatingWired) { sendBtn.dataset.estimatingWired = "true"; sendBtn.addEventListener("click", sendEstimatingEmailFromApp); }
  updateEstimatingPreview();
}
document.addEventListener("DOMContentLoaded", () => setTimeout(setupEstimatingPage, 700));
document.addEventListener("click", function(event) {
  const btn = event.target.closest && event.target.closest('[data-admin-page="estimatingPage"]');
  if (btn) setTimeout(setupEstimatingPage, 100);
}, true);


/* V126 material note required support */
(function(){
  function boolFromInputValue(value) {
    const text = String(value ?? "").trim().toLowerCase();
    return text === "true" || text === "yes" || text === "1";
  }

  window.categoriesToMaterialRows = function(categories) {
    const rows = [];
    const cleanedCategories = typeof dedupeCategoryItems === "function" ? dedupeCategoryItems(categories) : categories;

    Object.entries(cleanedCategories || {}).forEach(([categoryKey, category]) => {
      const categoryLabel = category && category.label ? category.label : categoryKey;
      const items = category && Array.isArray(category.items) ? category.items : [];

      items.forEach((item, index) => {
        rows.push({
          Category: categoryKey,
          "Category Label": categoryLabel,
          Material: item.name || "",
          Icon: item.icon || "",
          Options: Array.isArray(item.options) ? item.options.join(", ") : "",
          Units: Array.isArray(item.units) ? item.units.join(", ") : "Each",
          "Notes Enabled": item.notesEnabled ? true : false,
          Active: true,
          SortOrder: index + 1
        });
      });
    });
    return rows;
  };

  window.materialRowsToCategories = function(rows, categoryRows) {
    const categories = typeof buildAdminCategoriesFromCategoryRows === "function" ? buildAdminCategoriesFromCategoryRows(categoryRows) : {};
    if (!Array.isArray(rows)) return null;

    const sortedRows = [...rows].sort((a, b) => {
      const ac = String(a.category ?? a.Category ?? "").localeCompare(String(b.category ?? b.Category ?? ""));
      if (ac !== 0) return ac;
      const ao = Number(a.sortOrder ?? a.SortOrder ?? 999999);
      const bo = Number(b.sortOrder ?? b.SortOrder ?? 999999);
      return ao - bo;
    });

    sortedRows.forEach(row => {
      const activeValue = String(row.active ?? row.Active ?? "TRUE").trim().toLowerCase();
      if (["false", "no", "0", "inactive"].includes(activeValue)) return;
      const categoryKey = String(row.category ?? row.Category ?? "").trim();
      const categoryLabel = String(row.categoryLabel ?? row["Category Label"] ?? row.CategoryLabel ?? categoryKey).trim();
      const materialName = String(row.material ?? row.Material ?? "").trim();
      if (!categoryKey) return;
      if (!categories[categoryKey]) categories[categoryKey] = { label: categoryLabel || categoryKey, items: [] };
      if (!materialName) return;
      if (categories[categoryKey].items.some(existing => materialDedupeKey(categoryKey, existing.name) === materialDedupeKey(categoryKey, materialName))) return;
      const item = {
        icon: String(row.icon ?? row.Icon ?? "").trim() || "📦",
        name: materialName,
        units: parseCsvList(String(row.units ?? row.Units ?? "Each"))
      };
      if (!item.units.length) item.units = ["Each"];
      const options = parseCsvList(String(row.options ?? row.Options ?? ""));
      if (options.length) item.options = options;
      if (boolFromInputValue(row.notesEnabled ?? row["Notes Enabled"] ?? row.RequiresNote ?? row["Requires Note"])) item.notesEnabled = true;
      categories[categoryKey].items.push(item);
    });
    return Object.keys(categories).length ? categories : null;
  };

  window.addMaterial = async function() {
    const select = document.getElementById("materialCategorySelect");
    const categoryKey = select ? select.value : "";
    const name = document.getElementById("materialNameInput").value.trim();
    const icon = document.getElementById("materialIconInput").value.trim() || "•";
    const options = parseCsvList(document.getElementById("materialOptionsInput").value);
    const units = parseCsvList(document.getElementById("materialUnitsInput").value);
    const notesEnabled = boolFromInputValue((document.getElementById("materialNoteRequiredInput") || {}).value || "false");
    if (!categoryKey) return alert("Select a category.");
    if (!name) return alert("Enter a material name.");
    const categories = getCategories();
    if (!categories[categoryKey]) {
      const found = (window.materialAdminCategoryRowsV116 || []).find(cat => cat.category === categoryKey);
      categories[categoryKey] = { label: found ? found.categoryLabel : categoryKey, items: [] };
    }
    if (categories[categoryKey].items.some(item => String(item.name || "").toLowerCase() === name.toLowerCase())) return alert("That material already exists.");
    const newItem = { icon, name, units: units.length ? units : ["Each"] };
    if (options.length) newItem.options = options;
    if (notesEnabled) newItem.notesEnabled = true;
    categories[categoryKey].items.push(newItem);
    const cleaned = typeof dedupeCategoryItems === "function" ? dedupeCategoryItems(categories) : categories;
    localStorage.setItem("materialOrderCategories", JSON.stringify(cleaned));
    try { await saveMaterialsRowsV116(cleaned); } catch (err) { console.error(err); alert("Could not save material to Excel. Check Apps Script saveMaterials."); return; }
    ["materialNameInput", "materialIconInput", "materialOptionsInput", "materialUnitsInput"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
    const noteEl = document.getElementById("materialNoteRequiredInput"); if (noteEl) noteEl.value = "false";
    await loadMaterialCategoriesForAdmin();
    const s = document.getElementById("materialCategorySelect"); if (s) s.value = categoryKey;
    renderMaterialsForAdmin();
    if (typeof renderMaterialCategoryAdminListV116 === "function") renderMaterialCategoryAdminListV116();
    alert("Material added.");
  };

  window.saveMaterialEdit = function(index) {
    const categoryKey = document.getElementById("materialCategorySelect").value;
    const categories = getCategories();
    if (!categories[categoryKey] || !categories[categoryKey].items[index]) return alert("Material not found.");
    const icon = document.querySelector(`[data-material-icon="${index}"]`).value.trim() || "•";
    const name = document.querySelector(`[data-material-name="${index}"]`).value.trim();
    const options = parseCsvList(document.querySelector(`[data-material-options="${index}"]`).value);
    const units = parseCsvList(document.querySelector(`[data-material-units="${index}"]`).value);
    const notesEnabled = boolFromInputValue((document.querySelector(`[data-material-note-required="${index}"]`) || {}).value || "false");
    if (!name) return alert("Material name cannot be blank.");
    const next = { icon, name, units: units.length ? units : ["Each"] };
    if (options.length) next.options = options;
    if (notesEnabled) next.notesEnabled = true;
    categories[categoryKey].items[index] = next;
    saveCategories(categories);
    renderMaterialsForAdmin();
  };

  window.renderMaterialsForAdmin = function() {
    const categoryKey = document.getElementById("materialCategorySelect").value;
    const list = document.getElementById("materialManagerList");
    const categories = getCategories();
    const items = (categories[categoryKey] && categories[categoryKey].items) || [];
    if (!list) return;
    if (!items.length) { list.innerHTML = "<p class='admin-note'>No materials in this category.</p>"; return; }
    list.innerHTML = items.map((item, index) => {
      const options = item.options && item.options.length ? item.options.join(", ") : "";
      const units = item.units && item.units.length ? item.units.join(", ") : "Each";
      return `
        <div class="material-manager-row editable-material-row">
          <div class="material-edit-grid">
            <label class="admin-label">Icon<input value="${safeText(item.icon || "•")}" data-material-icon="${index}" /></label>
            <label class="admin-label">Material Name<input value="${safeText(item.name)}" data-material-name="${index}" /></label>
            <label class="admin-label wide">Size Options<input value="${safeText(options)}" data-material-options="${index}" placeholder='Example: 1/4", 3/8", 1/2"' /></label>
            <label class="admin-label wide">Unit Options<input value="${safeText(units)}" data-material-units="${index}" placeholder="Example: Box, Each" /></label>
            <label class="admin-label">Notes Enabled<select class="admin-select-light" data-material-note-required="${index}"><option value="false" ${item.notesEnabled ? "" : "selected"}>FALSE</option><option value="true" ${item.notesEnabled ? "selected" : ""}>TRUE</option></select></label>
          </div>
          <div class="material-edit-actions">
            <button class="save-material" data-move-material-up="${index}" type="button" ${index === 0 ? "disabled" : ""}>Move Up</button>
            <button class="save-material" data-move-material-down="${index}" type="button" ${index === items.length - 1 ? "disabled" : ""}>Move Down</button>
            <button class="save-material" data-save-material="${index}" type="button">Save</button>
            <button class="delete-material" data-delete-material="${index}" type="button">Delete</button>
          </div>
        </div>`;
    }).join("");
    document.querySelectorAll("[data-move-material-up]").forEach(button => button.addEventListener("click", () => moveMaterial(Number(button.dataset.moveMaterialUp), -1)));
    document.querySelectorAll("[data-move-material-down]").forEach(button => button.addEventListener("click", () => moveMaterial(Number(button.dataset.moveMaterialDown), 1)));
    document.querySelectorAll("[data-save-material]").forEach(button => button.addEventListener("click", () => saveMaterialEdit(Number(button.dataset.saveMaterial))));
    document.querySelectorAll("[data-delete-material]").forEach(button => button.addEventListener("click", () => deleteMaterial(Number(button.dataset.deleteMaterial))));
  };
})();

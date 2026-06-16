const SCRIPT_URL_STORAGE_KEY = "materialOrderGoogleAppsScriptUrl";
function getSavedScriptUrl() { return (localStorage.getItem(SCRIPT_URL_STORAGE_KEY) || "").trim(); }
function getGoogleAppsScriptUrl() {
  const directUrl = getSavedScriptUrl();
  if (directUrl) return directUrl;
  try {
    const settings = JSON.parse(localStorage.getItem("materialOrderSettings") || "{}");
    return String(settings.googleAppsScriptUrl || "").trim();
  } catch {
    return "";
  }
}



function safeText(text) {
  return String(text || "")
    .split("&").join("&amp;")
    .split("<").join("&lt;")
    .split(">").join("&gt;")
    .split('"').join("&quot;")
    .split("'").join("&#039;");
}

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  } catch {
    return value;
  }
}

function parseItems(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function priorityClass(priority) {
  if (priority === "Emergency") return "priority-emergency";
  if (priority === "Rush") return "priority-rush";
  return "priority-normal";
}

function currentBoardRole() {
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  const role = String((user && user.role) || "User").trim().toLowerCase();
  if (role === "admin") return "Admin";
  if (role === "operations manager" || role === "operations") return "Operations Manager";
  if (role === "manpower manager" || role === "manpower") return "Manpower Manager";
  return "User";
}

function canManageRentalBoard() {
  const role = currentBoardRole();
  return role === "Admin" || role === "Operations Manager";
}

function rentalStatusClass(status) {
  const value = String(status || "Requested").toLowerCase().replace(/\s+/g, "-");
  if (value === "called-off" || value === "not-active") return "delivered";
  if (value === "rented" || value === "active") return "ordered";
  return "pending";
}

function normalizeRentalStatus(status) {
  const value = String(status || "Requested").trim();
  if (value.toLowerCase() === "active") return "Rented";
  if (value.toLowerCase() === "not active") return "Called Off";
  return value || "Requested";
}

function formatRentalDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return value;
  }
}


async function loadOrders() {
  const list = document.getElementById("orderBoardList");
  const debug = document.getElementById("orderDebug");
  if (!list) return;

  list.innerHTML = "<p class='admin-note'>Loading shared orders...</p>";

  try {
    const response = await fetch(getGoogleAppsScriptUrl() + "?v=" + Date.now());
    const data = await response.json();
    const orders = Array.isArray(data.orders) ? data.orders.reverse() : [];
    const canManage = canManageRentalBoard();

    if (debug) debug.textContent = "Shared orders found: " + orders.length;

    if (!orders.length) {
      list.innerHTML = "<p class='admin-note'>No orders submitted yet.</p>";
      return;
    }

    list.innerHTML = orders.map(order => {
      const items = parseItems(order.items);
      const itemHtml = items.length ? items.map(item => `
        <div class="order-item-line">
          <span>${safeText(item.name || "Item")}</span>
          <strong>${safeText(item.qty || "")} ${safeText(item.unit || "")}</strong>
        </div>
      `).join("") : "<p class='admin-note'>No item details found.</p>";

      return `
        <div class="order-card">
          <div class="order-card-head">
            <div>
              <h3>${safeText(order.job || "Unknown Job")}</h3>
              <span>${safeText(formatDate(order.timestamp))}</span>
            </div>
            <span class="review-priority-select ${priorityClass(order.priority)}">${safeText(order.priority || "Normal")}</span>
          </div>

          <div class="order-meta">
            <span><strong>Requested By:</strong> ${safeText(order.requestedBy || "Unknown")}</span>
            <span><strong>Status:</strong> ${safeText(order.status || "Pending")}</span>
            ${order.orderNumber ? `<span><strong>Order #:</strong> ${safeText(order.orderNumber)}</span>` : ""}
          </div>

          <div class="order-items">${itemHtml}</div>
          ${order.notes ? `<div class="order-notes"><strong>Notes:</strong> ${safeText(order.notes)}</div>` : ""}

          ${canManage ? `
            <div class="order-board-actions">
              <button type="button" class="status-pending" data-order-status="Pending" data-order-id="${safeText(order.id)}">Pending</button>
              <button type="button" class="status-ordered" data-order-status="Ordered" data-order-id="${safeText(order.id)}">Ordered</button>
              <button type="button" class="status-delivered" data-order-status="Delivered" data-order-id="${safeText(order.id)}">Delivered</button>
              <button type="button" class="delete-order" data-delete-order="${safeText(order.id)}">Delete</button>
            </div>
          ` : ""}
        </div>
      `;
    }).join("");

    if (canManage) {
      document.querySelectorAll("[data-order-status]").forEach(button => {
        button.addEventListener("click", () => updateOrderBoardStatus(button.dataset.orderId, button.dataset.orderStatus));
      });

      document.querySelectorAll("[data-delete-order]").forEach(button => {
        button.addEventListener("click", () => deleteOrderBoardItem(button.dataset.deleteOrder));
      });
    }
  } catch (error) {
    console.error(error);
    if (debug) debug.textContent = "";
    list.innerHTML = "<p class='admin-error'>Could not load shared orders. Check Apps Script deployment permissions.</p>";
  }
}

async function updateOrderBoardStatus(id, status) {
  if (!canManageRentalBoard()) return alert("You do not have permission to update orders.");

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

  setTimeout(loadOrders, 700);
}

async function deleteOrderBoardItem(id) {
  if (!canManageRentalBoard()) return alert("You do not have permission to delete orders.");
  if (!confirm("Delete this order?")) return;

  await fetch(getGoogleAppsScriptUrl(), {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "deleteOrder",
      id
    })
  });

  setTimeout(loadOrders, 700);
}

async function loadRentalsBoard() {
  const list = document.getElementById("rentalBoardList");
  const debug = document.getElementById("rentalDebug");
  if (!list) return;

  list.innerHTML = "<p class='admin-note'>Loading rental requests...</p>";

  try {
    const response = await fetch(getGoogleAppsScriptUrl() + "?action=rentals&v=" + Date.now(), { cache: "no-store" });
    const data = await response.json();
    const rentals = Array.isArray(data.rentals) ? data.rentals.reverse() : [];
    const canManage = canManageRentalBoard();

    if (debug) debug.textContent = "Rental requests found: " + rentals.length;

    if (!rentals.length) {
      list.innerHTML = "<p class='admin-note'>No rental requests submitted yet.</p>";
      return;
    }

    list.innerHTML = rentals.map(rental => {
      const status = normalizeRentalStatus(rental.status);
      const offDate = rental.dateOffRent || "";
      return `
        <div class="order-card rental-board-card">
          <div class="order-card-head">
            <div>
              <h3>${safeText(rental.job || "Unknown Job")}</h3>
              <span>${safeText(formatDate(rental.dateAdded || rental.timestamp))}</span>
            </div>
            <span class="status-badge ${rentalStatusClass(status)}">${safeText(status)}</span>
          </div>

          <div class="order-meta">
            <span><strong>Rental Equipment:</strong> ${safeText(rental.rentalItem || "Rental")}</span>
            <span><strong>Qty:</strong> ${safeText(rental.quantity || 1)}</span>
            <span><strong>Requested By:</strong> ${safeText(rental.requestedBy || "Unknown")}</span>
            ${rental.vendor ? `<span><strong>Vendor:</strong> ${safeText(rental.vendor)}</span>` : ""}
            ${offDate ? `<span><strong>Called Off:</strong> ${safeText(formatRentalDate(offDate))}</span>` : ""}
          </div>

          ${rental.notes ? `<div class="order-notes"><strong>Notes:</strong> ${safeText(rental.notes)}</div>` : ""}

          ${canManage ? `
            <div class="rental-board-actions">
              <button type="button" class="status-pending" data-rental-status="Requested" data-rental-id="${safeText(rental.id)}">Requested</button>
              <button type="button" class="status-ordered" data-rental-status="Rented" data-rental-id="${safeText(rental.id)}">Rented</button>
              <button type="button" class="status-delivered" data-rental-status="Called Off" data-rental-id="${safeText(rental.id)}">Called Off</button>
              <label class="rental-off-date">Off Date <input type="date" value="${safeText(offDate)}" data-rental-off-date="${safeText(rental.id)}"></label>
              <button type="button" class="delete-order" data-delete-rental="${safeText(rental.id)}">Delete</button>
            </div>
          ` : ""}
        </div>
      `;
    }).join("");

    if (canManage) {
      document.querySelectorAll("[data-rental-status]").forEach(button => {
        button.addEventListener("click", () => updateRentalBoardStatus(button.dataset.rentalId, button.dataset.rentalStatus));
      });
      document.querySelectorAll("[data-delete-rental]").forEach(button => {
        button.addEventListener("click", () => deleteRentalBoardItem(button.dataset.deleteRental));
      });
    }
  } catch (error) {
    console.error(error);
    if (debug) debug.textContent = "";
    list.innerHTML = "<p class='admin-error'>Could not load rental requests. Check Apps Script deployment permissions.</p>";
  }
}

async function updateRentalBoardStatus(id, status) {
  if (!canManageRentalBoard()) return alert("You do not have permission to update rentals.");

  const offInput = document.querySelector(`[data-rental-off-date="${CSS.escape(id)}"]`);
  const dateOffRent = status === "Called Off" ? (offInput && offInput.value ? offInput.value : new Date().toISOString().slice(0,10)) : (offInput ? offInput.value : "");

  await fetch(getGoogleAppsScriptUrl(), {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "updateRental",
      id,
      status,
      quantity: 1,
      vendor: "",
      notes: "",
      dateOffRent
    })
  });

  setTimeout(loadRentalsBoard, 700);
}

async function deleteRentalBoardItem(id) {
  if (!canManageRentalBoard()) return alert("You do not have permission to delete rentals.");
  if (!confirm("Delete this rental request?")) return;

  await fetch(getGoogleAppsScriptUrl(), {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "deleteRental", id })
  });

  setTimeout(loadRentalsBoard, 700);
}


document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("refreshOrdersBtn");
  if (btn) btn.addEventListener("click", loadOrders);

  const rentalBtn = document.getElementById("refreshRentalsBoardBtn");
  if (rentalBtn) rentalBtn.addEventListener("click", loadRentalsBoard);

  if (document.getElementById("orderBoardList")) loadOrders();
  if (document.getElementById("rentalBoardList")) loadRentalsBoard();
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
  return getGoogleAppsScriptUrl();
}
function normalizeUserRole(role) {
  const value = String(role || "User").trim().toLowerCase();
  if (value === "admin") return "Admin";
  if (value === "operations manager" || value === "operations" || value === "operation manager") return "Operations Manager";
  if (value === "manpower manager" || value === "manpower") return "Manpower Manager";
  return "User";
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

function afterLoginRefresh() { if (typeof loadOrders === "function") loadOrders(); }

async function loadRentalsBoard() {
  const list = document.getElementById("rentalBoardList");
  const debug = document.getElementById("rentalDebug");
  if (!list) return;

  list.innerHTML = "<p class='admin-note'>Loading rental requests...</p>";

  try {
    const response = await fetch(getGoogleAppsScriptUrl() + "?action=rentals&v=" + Date.now(), { cache: "no-store" });
    const data = await response.json();
    const rentals = Array.isArray(data.rentals) ? data.rentals.reverse() : [];
    const canManage = canManageRentalBoard();

    if (debug) debug.textContent = "Rental requests found: " + rentals.length;

    if (!rentals.length) {
      list.innerHTML = "<p class='admin-note'>No rental requests submitted yet.</p>";
      return;
    }

    list.innerHTML = rentals.map(rental => {
      const status = normalizeRentalStatus(rental.status);
      const offDate = rental.dateOffRent || "";
      return `
        <div class="order-card rental-board-card">
          <div class="order-card-head">
            <div>
              <h3>${safeText(rental.job || "Unknown Job")}</h3>
              <span>${safeText(formatDate(rental.dateAdded || rental.timestamp))}</span>
            </div>
            <span class="status-badge ${rentalStatusClass(status)}">${safeText(status)}</span>
          </div>

          <div class="order-meta">
            <span><strong>Rental Equipment:</strong> ${safeText(rental.rentalItem || "Rental")}</span>
            <span><strong>Qty:</strong> ${safeText(rental.quantity || 1)}</span>
            <span><strong>Requested By:</strong> ${safeText(rental.requestedBy || "Unknown")}</span>
            ${rental.vendor ? `<span><strong>Vendor:</strong> ${safeText(rental.vendor)}</span>` : ""}
            ${offDate ? `<span><strong>Called Off:</strong> ${safeText(formatRentalDate(offDate))}</span>` : ""}
          </div>

          ${rental.notes ? `<div class="order-notes"><strong>Notes:</strong> ${safeText(rental.notes)}</div>` : ""}

          ${canManage ? `
            <div class="rental-board-actions">
              <button type="button" class="status-pending" data-rental-status="Requested" data-rental-id="${safeText(rental.id)}">Requested</button>
              <button type="button" class="status-ordered" data-rental-status="Rented" data-rental-id="${safeText(rental.id)}">Rented</button>
              <button type="button" class="status-delivered" data-rental-status="Called Off" data-rental-id="${safeText(rental.id)}">Called Off</button>
              <label class="rental-off-date">Off Date <input type="date" value="${safeText(offDate)}" data-rental-off-date="${safeText(rental.id)}"></label>
              <button type="button" class="delete-order" data-delete-rental="${safeText(rental.id)}">Delete</button>
            </div>
          ` : ""}
        </div>
      `;
    }).join("");

    if (canManage) {
      document.querySelectorAll("[data-rental-status]").forEach(button => {
        button.addEventListener("click", () => updateRentalBoardStatus(button.dataset.rentalId, button.dataset.rentalStatus));
      });
      document.querySelectorAll("[data-delete-rental]").forEach(button => {
        button.addEventListener("click", () => deleteRentalBoardItem(button.dataset.deleteRental));
      });
    }
  } catch (error) {
    console.error(error);
    if (debug) debug.textContent = "";
    list.innerHTML = "<p class='admin-error'>Could not load rental requests. Check Apps Script deployment permissions.</p>";
  }
}

async function updateRentalBoardStatus(id, status) {
  if (!canManageRentalBoard()) return alert("You do not have permission to update rentals.");

  const offInput = document.querySelector(`[data-rental-off-date="${CSS.escape(id)}"]`);
  const dateOffRent = status === "Called Off" ? (offInput && offInput.value ? offInput.value : new Date().toISOString().slice(0,10)) : (offInput ? offInput.value : "");

  await fetch(getGoogleAppsScriptUrl(), {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "updateRental",
      id,
      status,
      quantity: 1,
      vendor: "",
      notes: "",
      dateOffRent
    })
  });

  setTimeout(loadRentalsBoard, 700);
}

async function deleteRentalBoardItem(id) {
  if (!canManageRentalBoard()) return alert("You do not have permission to delete rentals.");
  if (!confirm("Delete this rental request?")) return;

  await fetch(getGoogleAppsScriptUrl(), {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "deleteRental", id })
  });

  setTimeout(loadRentalsBoard, 700);
}


document.addEventListener("DOMContentLoaded", () => { renderLoginGate({ requireAdmin: false }); });

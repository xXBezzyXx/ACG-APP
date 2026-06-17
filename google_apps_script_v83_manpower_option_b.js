const ORDERS_SHEET_NAME = "Orders";
const JOBS_SHEET_NAME = "Jobs";
const USERS_SHEET_NAME = "Users";
const SETTINGS_SHEET_NAME = "Settings";
const DAILY_REPORTS_SHEET_NAME = "DailyReports";
const RENTALS_SHEET_NAME = "Rentals";
const RENTAL_ITEMS_SHEET_NAME = "RentalItems";
const MANPOWER_EMPLOYEES_SHEET_NAME = "Employees";
const MANPOWER_JOBS_SHEET_NAME = "ManpowerJobs";
const MATERIALS_SHEET_NAME = "Materials";
const MATERIAL_CATEGORIES_SHEET_NAME = "MaterialCategories";

function doPost(e) {
  const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

  if (data.action === "saveSettings") {
    saveSettings_(data.settings || {});
    return json_({ success: true, action: "saveSettings" });
  }

  if (data.action === "saveUsers") {
    saveUsers_(data.users || []);
    return json_({ success: true, action: "saveUsers" });
  }

  if (data.action === "saveJobs") {
    saveJobs_(data.jobs || []);
    return json_({ success: true, action: "saveJobs" });
  }

  if (data.action === "saveMaterials") {
    saveMaterials_(data.materials || []);
    return json_({ success: true, action: "saveMaterials" });
  }

  if (data.action === "saveMaterialCategories") {
    saveMaterialCategories_(data.materialCategories || data.categories || []);
    return json_({ success: true, action: "saveMaterialCategories" });
  }

  if (data.action === "updateStatus") {
    const sheet = getOrdersSheet_();
    const row = Number(data.id);
    const status = data.status || "Pending";
    if (row && row >= 2) sheet.getRange(row, 7).setValue(status);
    return json_({ success: true, action: "updateStatus" });
  }

  if (data.action === "deleteOrder") {
    const sheet = getOrdersSheet_();
    const row = Number(data.id);
    if (row && row >= 2) sheet.deleteRow(row);
    return json_({ success: true, action: "deleteOrder" });
  }



  if (data.action === "saveManpowerBoard") {
    saveManpowerJobs_(data.jobs || []);
    saveManpowerEmployees_(data.employees || []);
    return json_({ success: true, action: "saveManpowerBoard" });
  }

  if (data.action === "saveRentalItems") {
    saveRentalItems_(data.rentalItems || []);
    return json_({ success: true, action: "saveRentalItems" });
  }

  if (data.action === "rentalRequest") {
    const sheet = getRentalsSheet_();
    sheet.appendRow([
      new Date(),
      data.job || "",
      data.rentalItem || "",
      Number(data.quantity || 1),
      data.status || "Active",
      data.requestedBy || "",
      data.vendor || "",
      data.notes || "",
      data.dateOffRent || ""
    ]);

    try {
      sendRentalRequestEmail_(data);
    } catch (err) {
      sheet.appendRow([new Date(), data.job || "", "EMAIL ERROR: " + err.message, "", "", data.requestedBy || "", "", "", ""]);
    }

    return json_({ success: true, action: "rentalRequest" });
  }

  if (data.action === "updateRental") {
    const sheet = getRentalsSheet_();
    const row = Number(data.id);
    if (row && row >= 2) {
      sheet.getRange(row, 4).setValue(Number(data.quantity || 0));
      sheet.getRange(row, 5).setValue(data.status || "Active");
      sheet.getRange(row, 7).setValue(data.vendor || "");
      sheet.getRange(row, 8).setValue(data.notes || "");
      sheet.getRange(row, 9).setValue(data.dateOffRent || "");
    }
    return json_({ success: true, action: "updateRental" });
  }

  if (data.action === "deleteRental") {
    const sheet = getRentalsSheet_();
    const row = Number(data.id);
    if (row && row >= 2) sheet.deleteRow(row);
    return json_({ success: true, action: "deleteRental" });
  }

  if (data.action === "dailyReport") {
    const reportNumber = data.reportNumber || makeDailyReportNumber_();
    const sheet = getDailyReportsSheet_();
    sheet.appendRow([
      new Date(),
      data.job || "",
      data.submittedBy || "",
      data.manpower || "",
      data.workPerformed || "",
      data.delays || "",
      data.safety || "",
      Number(data.photoCount || (data.photos && data.photos.length) || 0),
      reportNumber
    ]);
    try {
      sendDailyReportEmail_(Object.assign({}, data, { reportNumber: reportNumber }));
    } catch (err) {
      sheet.appendRow([new Date(), "EMAIL/PDF ERROR: " + err.message, "", "", "", "", "", "", reportNumber]);
    }
    return json_({ success: true, action: "dailyReport", reportNumber: reportNumber });
  }

  const sheet = getOrdersSheet_();
  const orderNumber = data.orderNumber || makeOrderNumber_();
  sheet.appendRow([
    new Date(),
    data.job || "",
    data.requestedBy || "",
    data.priority || "Normal",
    JSON.stringify(data.items || []),
    data.notes || "",
    data.status || "Pending",
    orderNumber
  ]);

  try {
    sendMaterialOrderEmail_(Object.assign({}, data, { orderNumber: orderNumber }));
  } catch (err) {
    // Do not block the order if email/pdf fails. Log the issue in Orders.
    sheet.appendRow([new Date(), "EMAIL/PDF ERROR: " + err.message, "", "", "", "", "", orderNumber]);
  }

  return json_({ success: true, action: "createOrder", orderNumber: orderNumber });
}

function doGet(e) {
  const action = String((e && e.parameter && e.parameter.action) || "").trim();

  if (action === "rentals") return json_({ success: true, rentals: getRentals_() });
  if (action === "rentalItems") return json_({ success: true, rentalItems: getRentalItems_() });
  if (action === "manpowerBoard") return json_({ success: true, employees: getManpowerEmployees_(), jobs: getManpowerJobs_() });

  if (action === "materials") {
    return json_({ success: true, materials: getMaterials_(), materialCategories: getMaterialCategories_() });
  }

  if (action === "materialCategories") {
    return json_({ success: true, materialCategories: getMaterialCategories_() });
  }

  if (action === "settings") return json_({ success: true, settings: getSettings_() });
  if (action === "jobs") return json_({ success: true, jobs: getJobs_() });
  if (action === "users") return json_({ success: true, users: getUsers_() });
  if (action === "login") return json_(loginUser_(e.parameter.username || "", e.parameter.password || ""));
  if (action === "changePassword") return json_(changePassword_(e.parameter.username || "", e.parameter.currentPassword || "", e.parameter.newPassword || ""));

  if (action === "testEmail") {
    const to = e.parameter.to || "nmcdonald@acgeneral.net";
    MailApp.sendEmail({ to, subject: "Material Order App Test Email", body: "Email permission is working." });
    return json_({ success: true, action: "testEmail", to });
  }

  return json_({ success: true, orders: getOrders_() });
}

function getSpreadsheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("No active spreadsheet found. Open this script from Extensions > Apps Script inside the Google Sheet.");
  return ss;
}

function getOrCreateSheet_(name, headers) {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  } else {
    const existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    let needsHeader = false;
    for (let i = 0; i < headers.length; i++) {
      if (!existing[i]) needsHeader = true;
    }
    if (needsHeader) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  return sheet;
}




function getJobEmailByName_(jobName) {
  const jobs = getJobs_();
  const match = jobs.find(job => String(job.name || "").trim().toLowerCase() === String(jobName || "").trim().toLowerCase());
  return match ? String(match.email || "").trim() : "";
}

function sendRentalRequestEmail_(data) {
  const to = getJobEmailByName_(data.job || "") || data.toEmail || "";
  if (!to) return;

  const qty = Number(data.quantity || 1);
  const job = data.job || "";
  const rentalItem = data.rentalItem || "";
  const requestedBy = data.requestedBy || "";
  const vendor = data.vendor || "";
  const notes = data.notes || "";

  const subject = "Rental Equipment Request - " + job;

  const htmlBody =
    '<div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;color:#111827;">' +
      '<div style="background:#0f172a;color:#ffffff;padding:18px 22px;border-radius:14px 14px 0 0;">' +
        '<h1 style="margin:0;font-size:24px;">Rental Equipment Request</h1>' +
      '</div>' +

      '<div style="border:1px solid #e5e7eb;border-top:0;padding:22px;border-radius:0 0 14px 14px;">' +
        '<h2 style="margin:0 0 14px;font-size:22px;color:#0f172a;">' + escapeHtml_(job) + '</h2>' +

        '<table style="width:100%;border-collapse:collapse;margin-top:10px;">' +
          '<tr>' +
            '<td style="padding:12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;width:34%;">Rental Equipment</td>' +
            '<td style="padding:12px;border:1px solid #e5e7eb;">' + escapeHtml_(rentalItem) + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding:12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;">Quantity</td>' +
            '<td style="padding:12px;border:1px solid #e5e7eb;">' + qty + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding:12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;">Requested By</td>' +
            '<td style="padding:12px;border:1px solid #e5e7eb;">' + escapeHtml_(requestedBy) + '</td>' +
          '</tr>' +
          (vendor ? '<tr><td style="padding:12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;">Vendor</td><td style="padding:12px;border:1px solid #e5e7eb;">' + escapeHtml_(vendor) + '</td></tr>' : '') +
          (notes ? '<tr><td style="padding:12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;">Notes</td><td style="padding:12px;border:1px solid #e5e7eb;">' + escapeHtml_(notes) + '</td></tr>' : '') +
        '</table>' +

        '<p style="margin-top:18px;color:#6b7280;font-size:13px;">This rental request was submitted from the AC General Material Order App.</p>' +
      '</div>' +
    '</div>';

  const plainBody =
    "Rental Equipment Request\\n\\n" +
    "Job: " + job + "\\n" +
    "Rental Equipment: " + rentalItem + "\\n" +
    "Quantity: " + qty + "\\n" +
    "Requested By: " + requestedBy + "\\n" +
    (vendor ? "Vendor: " + vendor + "\\n" : "") +
    (notes ? "Notes: " + notes + "\\n" : "");

  MailApp.sendEmail({
    to: to,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody
  });
}



function getManpowerEmployeesSheet_() {
  return getOrCreateSheet_(MANPOWER_EMPLOYEES_SHEET_NAME, ["Employee", "Position", "Assigned To", "Active"]);
}

function getManpowerJobsSheet_() {
  return getOrCreateSheet_(MANPOWER_JOBS_SHEET_NAME, ["Job", "Locked", "SortOrder"]);
}

function seedManpowerJobsIfEmpty_() {
  const sheet = getManpowerJobsSheet_();
  if (sheet.getLastRow() > 1) return;
  sheet.getRange(2, 1, 3, 3).setValues([
    ["Unassigned", true, 1],
    ["Shop", true, 2],
    ["Vacation", true, 3]
  ]);
}

function getManpowerJobs_() {
  seedManpowerJobsIfEmpty_();
  const sheet = getManpowerJobsSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  values.shift();

  return values
    .filter(row => row[0])
    .map((row, index) => ({
      name: String(row[0] || ""),
      locked: row[1] === true || String(row[1]).toLowerCase() === "true",
      sortOrder: row[2] || index + 1
    }))
    .sort((a, b) => Number(a.sortOrder || 999999) - Number(b.sortOrder || 999999));
}

function saveManpowerJobs_(jobs) {
  const sheet = getManpowerJobsSheet_();
  const existing = getManpowerJobs_();
  const combined = [];
  const seen = {};

  existing.concat(jobs || []).forEach((job, index) => {
    const name = String(job.name || job.Job || "").trim();
    if (!name) return;
    const key = name.toLowerCase();
    if (seen[key]) return;
    seen[key] = true;
    combined.push([name, job.locked ? true : false, combined.length + 1]);
  });

  if (!seen["unassigned"]) combined.unshift(["Unassigned", true, 1]);
  if (!seen["shop"]) combined.push(["Shop", true, combined.length + 1]);
  if (!seen["vacation"]) combined.push(["Vacation", true, combined.length + 1]);

  sheet.clearContents();
  sheet.appendRow(["Job", "Locked", "SortOrder"]);
  if (combined.length) sheet.getRange(2, 1, combined.length, 3).setValues(combined);
}

function getManpowerEmployees_() {
  const sheet = getManpowerEmployeesSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  values.shift();

  return values
    .filter(row => row[0])
    .map(row => ({
      name: String(row[0] || ""),
      position: String(row[1] || ""),
      assignedTo: String(row[2] || "Unassigned"),
      active: !(row[3] === false || String(row[3]).toLowerCase() === "false")
    }));
}

function saveManpowerEmployees_(employees) {
  const sheet = getManpowerEmployeesSheet_();
  sheet.clearContents();
  sheet.appendRow(["Employee", "Position", "Assigned To", "Active"]);

  const rows = (employees || [])
    .filter(employee => employee.name || employee.Employee)
    .map(employee => [
      employee.name || employee.Employee || "",
      employee.position || employee.Position || "",
      employee.assignedTo || employee["Assigned To"] || "Unassigned",
      employee.active === false ? false : true
    ]);

  if (rows.length) sheet.getRange(2, 1, rows.length, 4).setValues(rows);
}


function getRentalItemsSheet_() {
  return getOrCreateSheet_(RENTAL_ITEMS_SHEET_NAME, ["Rental Item", "Icon", "Active", "Custom", "SortOrder"]);
}

function seedRentalItemsIfEmpty_() {
  const sheet = getRentalItemsSheet_();
  if (sheet.getLastRow() > 1) return;
  const rows = [
    ["Conex", "🚚", true, false, 1],
    ["Lull", "🚜", true, false, 2],
    ["Scissor Lift", "↕️", true, false, 3],
    ["Boom Lift", "🏗️", true, false, 4],
    ["Porta John", "🚻", true, false, 5],
    ["Other / Custom", "➕", true, true, 6]
  ];
  sheet.getRange(2, 1, rows.length, 5).setValues(rows);
}

function getRentalItems_() {
  seedRentalItemsIfEmpty_();
  const sheet = getRentalItemsSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  values.shift();

  return values
    .filter(row => row[0])
    .map((row, index) => ({
      name: String(row[0] || ""),
      icon: String(row[1] || "📦"),
      active: !(row[2] === false || String(row[2]).toLowerCase() === "false"),
      custom: row[3] === true || String(row[3]).toLowerCase() === "true",
      sortOrder: row[4] || index + 1
    }))
    .sort((a, b) => Number(a.sortOrder || 999999) - Number(b.sortOrder || 999999));
}

function saveRentalItems_(items) {
  const sheet = getRentalItemsSheet_();
  const header = ["Rental Item", "Icon", "Active", "Custom", "SortOrder"];
  const rows = [header];
  const seen = {};

  (items || []).forEach((item) => {
    const name = String(item.name || item["Rental Item"] || "").trim();
    if (!name) return;
    const key = name.toLowerCase();
    if (seen[key]) return;
    seen[key] = true;
    rows.push([
      name,
      item.icon || item.Icon || "📦",
      item.active === false ? false : true,
      item.custom === true ? true : false,
      item.sortOrder || rows.length
    ]);
  });

  if (!seen["other / custom"]) rows.push(["Other / Custom", "➕", true, true, rows.length]);

  sheet.clear();
  sheet.getRange(1, 1, rows.length, header.length).setValues(rows);
}


function getRentalsSheet_() {
  return getOrCreateSheet_(RENTALS_SHEET_NAME, ["Date Added", "Job", "Rental Item", "Quantity", "Status", "Requested By", "Vendor", "Notes", "Date Off Rent"]);
}

function getRentals_() {
  const sheet = getRentalsSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  values.shift();
  return values.filter(row => row[1] || row[2]).map((row, index) => ({
    id: index + 2,
    dateAdded: row[0],
    job: String(row[1] || ""),
    rentalItem: String(row[2] || ""),
    quantity: row[3] || 1,
    status: String(row[4] || "Active"),
    requestedBy: String(row[5] || ""),
    vendor: String(row[6] || ""),
    notes: String(row[7] || ""),
    dateOffRent: row[8] ? Utilities.formatDate(new Date(row[8]), Session.getScriptTimeZone(), "yyyy-MM-dd") : ""
  }));
}


function getOrdersSheet_() {
  return getOrCreateSheet_(ORDERS_SHEET_NAME, ["Timestamp", "Job", "Requested By", "Priority", "Items", "Notes", "Status", "Order Number"]);
}

function getJobsSheet_() {
  return getOrCreateSheet_(JOBS_SHEET_NAME, ["Job Name", "Active", "Email"]);
}

function getUsersSheet_() {
  const sheet = getOrCreateSheet_(USERS_SHEET_NAME, ["Username", "Password", "Role", "Email", "Active", "Must Change Password", "Display Name"]);
  if (sheet.getLastRow() < 2) sheet.appendRow(["nick", "1234", "Admin", "nmcdonald@acgeneral.net", true, true, "Nick"]);
  return sheet;
}

function getSettingsSheet_() {
  return getOrCreateSheet_(SETTINGS_SHEET_NAME, ["Setting", "Value"]);
}

function getDailyReportsSheet_() {
  return getOrCreateSheet_(DAILY_REPORTS_SHEET_NAME, ["Timestamp", "Job", "Submitted By", "Manpower Count", "Work Performed", "Delays / Issues", "Safety Issues", "Photo Count", "Report Number"]);
}

function getOrders_() {
  const sheet = getOrdersSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  values.shift();
  return values.map((row, index) => ({
    id: index + 2,
    timestamp: row[0],
    job: row[1],
    requestedBy: row[2],
    priority: row[3],
    items: row[4],
    notes: row[5],
    status: row[6],
    orderNumber: row[7] || ""
  })).filter(order => String(order.job || "").indexOf("EMAIL/PDF ERROR:") !== 0);
}

function getJobs_() {
  const sheet = getJobsSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  values.shift();
  return values.filter(row => row[0]).map(row => ({
    name: String(row[0] || ""),
    active: !(row[1] === false || String(row[1]).toLowerCase() === "false"),
    email: String(row[2] || "")
  }));
}

function saveJobs_(jobs) {
  const sheet = getJobsSheet_();
  sheet.clearContents();
  sheet.appendRow(["Job Name", "Active", "Email"]);
  if (!Array.isArray(jobs) || !jobs.length) return;
  const rows = jobs.map(job => [job.name || "", job.active === false ? false : true, job.email || ""]).filter(row => row[0]);
  if (rows.length) sheet.getRange(2, 1, rows.length, 3).setValues(rows);
}

function getUsers_() {
  const sheet = getUsersSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  values.shift();
  return values.filter(row => row[0]).map(row => ({
    username: String(row[0] || ""),
    password: String(row[1] || ""),
    role: String(row[2] || "User"),
    email: String(row[3] || ""),
    active: !(row[4] === false || String(row[4]).toLowerCase() === "false"),
    mustChangePassword: row[5] === true || String(row[5]).toLowerCase() === "true",
    displayName: String(row[6] || row[0] || "")
  }));
}

function saveUsers_(users) {
  const sheet = getUsersSheet_();
  sheet.clearContents();
  sheet.appendRow(["Username", "Password", "Role", "Email", "Active", "Must Change Password", "Display Name"]);
  if (!Array.isArray(users) || !users.length) {
    sheet.appendRow(["nick", "1234", "Admin", "nmcdonald@acgeneral.net", true, true, "Nick"]);
    return;
  }
  const rows = users.map(user => [
    user.username || "",
    user.password || "Temp123",
    user.role || "User",
    user.email || "",
    user.active === false ? false : true,
    user.mustChangePassword ? true : false,
    user.displayName || user.username || ""
  ]).filter(row => row[0]);
  if (rows.length) sheet.getRange(2, 1, rows.length, 7).setValues(rows);
}

function loginUser_(username, password) {
  username = String(username || "").trim().toLowerCase();
  password = String(password || "");
  if (!username || !password) return { success: false, message: "Enter username and password." };
  const user = getUsers_().find(u => String(u.username || "").trim().toLowerCase() === username);
  if (!user) return { success: false, message: "User not found." };
  if (user.active === false) return { success: false, message: "This user is inactive." };
  if (String(user.password || "") !== password) return { success: false, message: "Incorrect password." };
  return { success: true, user: publicUser_(user) };
}

function changePassword_(username, currentPassword, newPassword) {
  username = String(username || "").trim().toLowerCase();
  currentPassword = String(currentPassword || "");
  newPassword = String(newPassword || "");
  if (!username || !currentPassword || !newPassword) return { success: false, message: "Missing password information." };
  if (newPassword.length < 4) return { success: false, message: "New password must be at least 4 characters." };
  const sheet = getUsersSheet_();
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0] || "").trim().toLowerCase() === username) {
      if (String(values[i][1] || "") !== currentPassword) return { success: false, message: "Current password is incorrect." };
      sheet.getRange(i + 1, 2).setValue(newPassword);
      sheet.getRange(i + 1, 6).setValue(false);
      return { success: true };
    }
  }
  return { success: false, message: "User not found." };
}

function publicUser_(user) {
  return {
    username: user.username,
    role: user.role || "User",
    email: user.email || "",
    active: user.active !== false,
    mustChangePassword: user.mustChangePassword === true,
    displayName: user.displayName || user.username
  };
}

function getSettings_() {
  const sheet = getSettingsSheet_();
  const values = sheet.getDataRange().getValues();
  const settings = {};
  for (let i = 1; i < values.length; i++) {
    const key = String(values[i][0] || "").trim();
    if (key) settings[key] = values[i][1] || "";
  }
  return settings;
}

function saveSettings_(settings) {
  const sheet = getSettingsSheet_();
  const current = getSettings_();
  const merged = Object.assign({}, current, settings || {});
  sheet.clearContents();
  sheet.appendRow(["Setting", "Value"]);
  const rows = Object.keys(merged).map(key => [key, merged[key]]).filter(row => row[0]);
  if (rows.length) sheet.getRange(2, 1, rows.length, 2).setValues(rows);
}

function sendMaterialOrderEmail_(data) {
  const to = data.toEmail || "nmcdonald@acgeneral.net";
  const subject = data.emailSubject || ("Material Order - " + (data.job || "Job"));
  const body = data.emailBody || buildPlainTextOrder_(data);
  const pdf = buildMaterialOrderPdf_(data);
  const fromEmail = String(data.fromEmail || "").trim();
  const senderName = String(data.senderName || "Material Order App").trim();

  if (fromEmail) {
    try {
      GmailApp.sendEmail(to, subject, body, { attachments: [pdf], from: fromEmail, name: senderName });
      return;
    } catch (err) {
      // Alias failed; send anyway from script owner.
    }
  }
  MailApp.sendEmail({ to, subject, body, attachments: [pdf] });
}

function buildPlainTextOrder_(data) {
  const items = Array.isArray(data.items) ? data.items : [];
  const lines = items.map(item => "- " + (item.name || item.material || "Material") + ": " + (item.qty || "") + " " + (item.unit || "")).join("\n");
  return "Material Order Form\n\n" +
    "Order #: " + (data.orderNumber || "") + "\n" +
    "Job: " + (data.job || "") + "\n" +
    "Date: " + new Date().toLocaleString() + "\n" +
    "Priority: " + (data.priority || "Normal") + "\n" +
    "Requested By: " + (data.requestedBy || "") + "\n\n" +
    "Items Needed:\n" + lines + "\n\n" +
    "Additional Notes:\n" + (data.notes || "None");
}

function buildMaterialOrderPdf_(data) {
  const letter = defaultedLetterhead_(data.pdfLetterhead || {});
  const items = Array.isArray(data.items) ? data.items : [];
  const orderNo = data.orderNumber || makeOrderNumber_();
  const created = data.createdAt ? new Date(data.createdAt) : new Date();
  const dateText = Utilities.formatDate(created, Session.getScriptTimeZone(), "MM/dd/yyyy h:mm a");
  const rows = items.map((item, index) => {
    const material = item.material || materialFromName_(item.name || "");
    const option = item.option || optionFromName_(item.name || "");
    return "<tr><td>" + (index + 1) + "</td><td>" + escapeHtml_(material) + "</td><td>" + escapeHtml_(option) + "</td><td>" + escapeHtml_(item.qty || "") + "</td><td>" + escapeHtml_(item.unit || "") + "</td><td></td></tr>";
  }).join("") + blankRows_(Math.max(0, 6 - items.length));

  const html = "<!doctype html><html><head><meta charset='utf-8'><style>" +
    "@page{size:letter;margin:24px}body{font-family:Arial,Helvetica,sans-serif;color:#0f172a;font-size:12px}.header{display:grid;grid-template-columns:150px 1fr 150px;gap:12px;align-items:start}.logo,.gator{max-width:140px;max-height:90px;object-fit:contain}.gator{justify-self:end}.headline{text-align:center}.line{font-family:Georgia,serif;font-weight:bold;font-style:italic;color:#088aa6;font-size:24px}.contact{font-size:12px;line-height:1.35}.site{color:#0b3a6e;font-weight:bold}.rule{border-top:3px solid #08356d;margin:10px 0}.doc-title{text-align:center;color:#08356d;font-weight:800}.company{font-size:20px}.title{font-size:26px}.box-grid{display:grid;grid-template-columns:1fr 1fr 1fr;border:1.5px solid #27588f;margin-bottom:10px}.box{padding:10px;border-right:1.5px solid #27588f}.box:last-child{border-right:0}.label{font-size:11px;font-weight:800;color:#08356d;text-transform:uppercase}.value{font-size:14px;font-weight:700;margin-top:5px}.section-title{background:#08356d;color:#fff;text-align:center;font-weight:800;font-size:16px;padding:7px;border:1.5px solid #08356d}table{width:100%;border-collapse:collapse;margin-bottom:12px}th,td{border:1px solid #6b8db5;padding:8px;vertical-align:top}th{background:#f8fafc;text-transform:uppercase;font-size:11px}.notes,.received{border:1.5px solid #27588f;padding:10px;margin-bottom:12px}.received h3{text-align:center;color:#08356d;margin:0 0 10px}.fill{display:inline-block;border-bottom:1px solid #555;width:70%;height:14px}.footer{text-align:center;color:#08356d;font-style:italic;font-weight:bold;margin-top:12px}" +
    "</style></head><body>" +
    "<div class='header'>" + imageTag_(letter.leftLogo, "logo") + "<div class='headline'><div class='line'>" + escapeHtml_(letter.titleLine1) + "</div><div class='line'>" + escapeHtml_(letter.titleLine2) + "</div><div class='contact'>" + escapeHtml_(letter.address) + "<br>" + escapeHtml_(letter.phoneFax) + "<br><span class='site'>" + escapeHtml_(letter.website) + "</span><br>" + escapeHtml_(letter.license) + "</div></div>" + imageTag_(letter.rightLogo, "gator") + "</div>" +
    "<div class='rule'></div><div class='doc-title'><div class='company'>" + escapeHtml_(letter.companyName) + "</div><div class='title'>" + escapeHtml_(letter.documentTitle) + "</div></div><div class='rule'></div>" +
    "<div class='box-grid'><div class='box'><div class='label'>Order #</div><div class='value'>" + escapeHtml_(orderNo) + "</div></div><div class='box'><div class='label'>Date</div><div class='value'>" + escapeHtml_(dateText) + "</div></div><div class='box'><div class='label'>Requested By</div><div class='value'>" + escapeHtml_(data.requestedBy || "") + "</div></div></div>" +
    "<div class='box-grid' style='grid-template-columns:1.5fr 1fr'><div class='box'><div class='label'>Job Name / Number</div><div class='value'>" + escapeHtml_(data.job || "") + "</div></div><div class='box'><div class='label'>Delivery Location</div><div class='value'>" + escapeHtml_(data.deliveryLocation || ((data.job || "") + " Jobsite")) + "</div></div></div>" +
    "<div class='section-title'>MATERIALS REQUESTED</div><table><thead><tr><th>#</th><th>Material</th><th>Size / Option</th><th>Qty</th><th>Unit</th><th>Notes</th></tr></thead><tbody>" + rows + "</tbody></table>" +
    "<div class='notes'><div class='label'>Additional Notes / Special Instructions</div><div>" + escapeHtml_(data.notes || "None") + "</div></div>" +
    "<div class='received'><h3>RECEIVED BY / JOB SITE</h3><p>Received By: <span class='fill'></span></p><p>Date Received: <span class='fill'></span></p><p>Notes: <span class='fill'></span></p></div>" +
    "<div class='footer'>" + escapeHtml_(letter.footerMessage) + "</div><div style='text-align:center;font-size:10px'>This is an electronically generated document.</div>" +
    "</body></html>";

  return Utilities.newBlob(html, "text/html", "material-order.html").getAs(MimeType.PDF).setName(makeSafeFileName_("Material Order - " + (data.job || "Job") + " - " + orderNo + ".pdf"));
}


function sendDailyReportEmail_(data) {
  const to = data.toEmail || "nmcdonald@acgeneral.net";
  const settings = getSettings_();
  const cc = String(data.dailyReportCcEmail || settings.dailyReportCcEmail || "").trim();
  const subject = data.emailSubject || ("Daily Report - " + (data.job || "Job") + " - " + (data.reportNumber || ""));
  const body = "Daily Report\n\n" +
    "Report #: " + (data.reportNumber || "") + "\n" +
    "Job: " + (data.job || "") + "\n" +
    "Submitted By: " + (data.submittedBy || "") + "\n" +
    "Manpower Count: " + (data.manpower || "") + "\n\n" +
    "Work Performed Today:\n" + (data.workPerformed || "") + "\n\n" +
    "Delays / Issues:\n" + (data.delays || "None") + "\n\n" +
    "Safety Issues:\n" + (data.safety || "None");
  const pdf = buildDailyReportPdf_(data);
  const options = { to: to, subject: subject, body: body, attachments: [pdf] };
  if (cc) options.cc = cc;
  MailApp.sendEmail(options);
}

function buildDailyReportPdf_(data) {
  const letter = defaultedLetterhead_(data.pdfLetterhead || {});
  const reportNo = data.reportNumber || makeDailyReportNumber_();
  const created = data.createdAt ? new Date(data.createdAt) : new Date();
  const dateText = Utilities.formatDate(created, Session.getScriptTimeZone(), "MM/dd/yyyy h:mm a");
  const photos = Array.isArray(data.photos) ? data.photos.slice(0, 6) : [];
  const photoHtml = photos.length ? photos.map(function(photo, index) {
    const src = String(photo.dataUrl || "");
    return "<div class='photo-card'><div class='photo-title'>Photo " + (index + 1) + "</div><img src='" + src + "'></div>";
  }).join("") : "<div class='notes'>No photos attached.</div>";

  const html = "<!doctype html><html><head><meta charset='utf-8'><style>" +
    "@page{size:letter;margin:24px}body{font-family:Arial,Helvetica,sans-serif;color:#0f172a;font-size:12px}.header{display:grid;grid-template-columns:150px 1fr 150px;gap:12px;align-items:start}.logo,.gator{max-width:140px;max-height:90px;object-fit:contain}.gator{justify-self:end}.headline{text-align:center}.line{font-family:Georgia,serif;font-weight:bold;font-style:italic;color:#088aa6;font-size:24px}.contact{font-size:12px;line-height:1.35}.site{color:#0b3a6e;font-weight:bold}.rule{border-top:3px solid #08356d;margin:10px 0}.doc-title{text-align:center;color:#08356d;font-weight:800}.company{font-size:20px}.title{font-size:26px}.box-grid{display:grid;grid-template-columns:1fr 1fr 1fr;border:1.5px solid #27588f;margin-bottom:10px}.box{padding:10px;border-right:1.5px solid #27588f}.box:last-child{border-right:0}.label{font-size:11px;font-weight:800;color:#08356d;text-transform:uppercase}.value{font-size:14px;font-weight:700;margin-top:5px}.section-title{background:#08356d;color:#fff;text-align:center;font-weight:800;font-size:16px;padding:7px;border:1.5px solid #08356d;margin-top:12px}.notes{border:1.5px solid #27588f;padding:10px;margin-bottom:12px;white-space:pre-wrap;line-height:1.45}.photos{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px}.photo-card{break-inside:avoid;border:1.5px solid #27588f;padding:8px}.photo-title{font-weight:800;color:#08356d;margin-bottom:6px}.photo-card img{width:100%;max-height:300px;object-fit:contain}.footer{text-align:center;color:#08356d;font-style:italic;font-weight:bold;margin-top:12px}" +
    "</style></head><body>" +
    "<div class='header'>" + imageTag_(letter.leftLogo, "logo") + "<div class='headline'><div class='line'>" + escapeHtml_(letter.titleLine1) + "</div><div class='line'>" + escapeHtml_(letter.titleLine2) + "</div><div class='contact'>" + escapeHtml_(letter.address) + "<br>" + escapeHtml_(letter.phoneFax) + "<br><span class='site'>" + escapeHtml_(letter.website) + "</span><br>" + escapeHtml_(letter.license) + "</div></div>" + imageTag_(letter.rightLogo, "gator") + "</div>" +
    "<div class='rule'></div><div class='doc-title'><div class='company'>" + escapeHtml_(letter.companyName) + "</div><div class='title'>DAILY REPORT</div></div><div class='rule'></div>" +
    "<div class='box-grid'><div class='box'><div class='label'>Report #</div><div class='value'>" + escapeHtml_(reportNo) + "</div></div><div class='box'><div class='label'>Date / Time</div><div class='value'>" + escapeHtml_(dateText) + "</div></div><div class='box'><div class='label'>Submitted By</div><div class='value'>" + escapeHtml_(data.submittedBy || "") + "</div></div></div>" +
    "<div class='box-grid' style='grid-template-columns:1.5fr 1fr'><div class='box'><div class='label'>Job Name / Number</div><div class='value'>" + escapeHtml_(data.job || "") + "</div></div><div class='box'><div class='label'>Manpower Count</div><div class='value'>" + escapeHtml_(data.manpower || "") + "</div></div></div>" +
    "<div class='section-title'>WORK PERFORMED TODAY</div><div class='notes'>" + escapeHtml_(data.workPerformed || "") + "</div>" +
    "<div class='section-title'>DELAYS / ISSUES</div><div class='notes'>" + escapeHtml_(data.delays || "None") + "</div>" +
    "<div class='section-title'>SAFETY ISSUES</div><div class='notes'>" + escapeHtml_(data.safety || "None") + "</div>" +
    "<div class='section-title'>PHOTOS</div><div class='photos'>" + photoHtml + "</div>" +
    "<div class='footer'>" + escapeHtml_(letter.footerMessage) + "</div><div style='text-align:center;font-size:10px'>This is an electronically generated document.</div>" +
    "</body></html>";

  return Utilities.newBlob(html, "text/html", "daily-report.html").getAs(MimeType.PDF).setName(makeSafeFileName_("Daily Report - " + (data.job || "Job") + " - " + reportNo + ".pdf"));
}

function makeDailyReportNumber_() { return "DR-" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd") + "-" + Math.floor(10000 + Math.random() * 90000); }

function blankRows_(count) { let out = ""; for (let i = 0; i < count; i++) out += "<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>"; return out; }
function materialFromName_(name) { const parts = String(name || "").split(" - "); return parts[0] || name; }
function optionFromName_(name) { const parts = String(name || "").split(" - "); return parts.length > 1 ? parts.slice(1).join(" - ") : ""; }
function defaultedLetterhead_(letter) { return { leftLogo: letter.leftLogo || "", rightLogo: letter.rightLogo || "", titleLine1: letter.titleLine1 || "Commercial Mechanical", titleLine2: letter.titleLine2 || "Industrial Refrigeration", address: letter.address || "401 Agmac Avenue, Jacksonville, FL 32254", phoneFax: letter.phoneFax || "Phone (904) 783-4200  Fax (904) 781-0806", website: letter.website || "acgeneral.net", license: letter.license || "CMC1250807", companyName: letter.companyName || "Company", documentTitle: letter.documentTitle || "MATERIAL PROCUREMENT REQUEST", footerMessage: letter.footerMessage || "Thank you for using the Material Order App!" }; }
function imageTag_(src, className) { return src ? "<img class='" + className + "' src='" + src + "'>" : "<div></div>"; }
function escapeHtml_(value) { return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;"); }
function makeSafeFileName_(value) { return String(value).replace(/[\\/:*?"<>|]/g, "-").slice(0, 140); }
function makeOrderNumber_() { return "ORD-" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd") + "-" + Math.floor(10000 + Math.random() * 90000); }


function getMaterialsSheet_() {
  return getOrCreateSheet_(MATERIALS_SHEET_NAME, ["Category", "Category Label", "Material", "Icon", "Options", "Units", "Active", "SortOrder"]);
}

function saveMaterials_(materials) {
  const sheet = getMaterialsSheet_();
  const header = ["Category", "Category Label", "Material", "Icon", "Options", "Units", "Active", "SortOrder"];
  const rows = [header];
  const seen = {};

  (materials || []).forEach((item) => {
    const category = String(item.Category || item.category || "").trim();
    const material = String(item.Material || item.material || "").trim();
    const key = category.toLowerCase() + "::" + material.toLowerCase();

    if (!category || !material || seen[key]) return;
    seen[key] = true;

    rows.push([
      category,
      item["Category Label"] || item.categoryLabel || "",
      material,
      item.Icon || item.icon || "",
      item.Options || item.options || "",
      item.Units || item.units || "",
      item.Active === undefined ? true : item.Active,
      item.SortOrder || item.sortOrder || rows.length
    ]);
  });

  sheet.clear();
  sheet.getRange(1, 1, rows.length, header.length).setValues(rows);
}

function getMaterials_() {
  const sheet = getMaterialsSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const headers = values.shift().map(h => String(h || "").trim());
  const seen = {};

  return values
    .filter(row => row.some(cell => String(cell || "").trim() !== ""))
    .map(row => {
      const object = {};
      headers.forEach((header, index) => {
        object[header] = row[index];
      });
      return {
        category: object["Category"] || "",
        categoryLabel: object["Category Label"] || "",
        material: object["Material"] || "",
        icon: object["Icon"] || "",
        options: object["Options"] || "",
        units: object["Units"] || "",
        active: object["Active"] === "" ? true : object["Active"],
        sortOrder: object["SortOrder"] || ""
      };
    })
    .filter(item => {
      const key = String(item.category || "").trim().toLowerCase() + "::" + String(item.material || "").trim().toLowerCase();
      if (!item.category || !item.material || seen[key]) return false;
      seen[key] = true;
      return true;
    })
    .sort((a, b) => {
      const ac = String(a.category || "").localeCompare(String(b.category || ""));
      if (ac !== 0) return ac;
      const ao = Number(a.sortOrder || 999999);
      const bo = Number(b.sortOrder || 999999);
      return ao - bo;
    });
}

function json_(object) { return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(ContentService.MimeType.JSON); }

function testEmailPermission() {
  MailApp.sendEmail({ to: "nmcdonald@acgeneral.net", subject: "Material Order App Email Test", body: "Email permission is working." });
}

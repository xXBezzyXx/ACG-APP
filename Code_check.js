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
const PDF_LETTERHEAD_SHEET_NAME = "PDFLetterhead";
const PROJECT_PERMITS_SHEET_NAME = "ProjectPermits";


function doPost(e) {
  const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

  if (data.action === "saveProjectPermit") {
    const permit = saveProjectPermit_(data);
    return json_({ success: true, action: "saveProjectPermit", permit: permit });
  }

  if (data.action === "deleteProjectPermit") {
    deleteProjectPermit_(data.id || "");
    return json_({ success: true, action: "deleteProjectPermit" });
  }

if (data.action === "estimatingEmail") {
  sendEstimatingEmail_(data);
  return json_({
    success: true,
    action: "estimatingEmail"
  });
}
  
  if (data.action === "saveMaterialCategories") {
  saveMaterialCategories_(data.materialCategories || data.categories || []);
  return json_({ success: true, action: "saveMaterialCategories" });
}

if (data.action === "addMaterialCategory") {
  const existing = getMaterialCategories_();

  existing.push({
    category: data.category || "",
    categoryLabel: data.categoryLabel || data.label || "",
    active: true,
    sortOrder: data.sortOrder || existing.length + 1
  });

  saveMaterialCategories_(existing);

  return json_({ success: true, action: "addMaterialCategory" });
}
  if (data.action === "saveSettings") {
    saveSettings_(data.settings || {});
    if (data.settings && data.settings.pdfLetterhead) savePdfLetterhead_(data.settings.pdfLetterhead);
    return json_({ success: true, action: "saveSettings" });
  }

  if (data.action === "savePdfLetterhead") {
    savePdfLetterhead_(data.pdfLetterhead || {});
    return json_({ success: true, action: "savePdfLetterhead" });
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
      data.rentalSize || "",
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
      sheet.appendRow([new Date(), data.job || "", "EMAIL ERROR: " + err.message, "", "", "", data.requestedBy || "", "", "", ""]);
    }

    return json_({ success: true, action: "rentalRequest" });
  }

  if (data.action === "updateRental") {
    const sheet = getRentalsSheet_();
    const row = Number(data.id);
    if (row && row >= 2) {
      sheet.getRange(row, 4).setValue(data.rentalSize || "");
      sheet.getRange(row, 5).setValue(Number(data.quantity || 0));
      sheet.getRange(row, 6).setValue(data.status || "Active");
      sheet.getRange(row, 8).setValue(data.vendor || "");
      sheet.getRange(row, 9).setValue(data.notes || "");
      sheet.getRange(row, 10).setValue(data.dateOffRent || "");
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

  if (action === "projectPermit") return json_({ success: true, permit: getProjectPermit_(e.parameter.job || "") });
  if (action === "projectPermits") return json_({ success: true, permits: getProjectPermits_(e.parameter.job || "") });

  if (action === "rentals") return json_({ success: true, rentals: getRentals_() });
  if (action === "rentalItems") return json_({ success: true, rentalItems: getRentalItems_() });
  if (action === "manpowerBoard") return json_({ success: true, employees: getManpowerEmployees_(), jobs: getManpowerJobs_() });

  if (action === "materials") {
    return json_({ success: true, materials: getMaterials_(), materialCategories: getMaterialCategories_() });
  }

  if (action === "materialCategories") {
    return json_({ success: true, materialCategories: getMaterialCategories_() });
  }

  if (action === "settings") {
    const settings = getSettings_();
    settings.pdfLetterhead = getPdfLetterhead_();
    return json_({ success: true, settings: settings, pdfLetterhead: settings.pdfLetterhead });
  }
  if (action === "pdfLetterhead") return json_({ success: true, pdfLetterhead: getPdfLetterhead_() });
  if (action === "jobs") return json_({ success: true, jobs: getJobs_() });
  if (action === "users") return json_({ success: true, users: getUsers_() });
  if (action === "login") return json_(loginUser_(e.parameter.username || "", e.parameter.password || ""));
  if (action === "changePassword") return json_(changePassword_(e.parameter.username || "", e.parameter.currentPassword || "", e.parameter.newPassword || ""));

  if (action === "testEmail") {
    const to = e.parameter.to || "popmods@gmail.com";
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
  const rentalSize = data.rentalSize || "";
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
          (rentalSize ? '<tr><td style="padding:12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;">Size</td><td style="padding:12px;border:1px solid #e5e7eb;">' + escapeHtml_(rentalSize) + '</td></tr>' : '') +
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

        '<p style="margin-top:18px;color:#6b7280;font-size:13px;">This rental request was submitted from the FieldOps App.</p>' +
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
  const headers = ["Rental Item", "Icon", "Active", "Custom", "Sizes", "SortOrder"];
  const sheet = getOrCreateSheet_(RENTAL_ITEMS_SHEET_NAME, headers);
  migrateSheetHeaders_(sheet, headers);
  return sheet;
}

function migrateSheetHeaders_(sheet, headers) {
  const lastCol = Math.max(sheet.getLastColumn(), headers.length);
  const existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h){ return String(h || '').trim(); });
  const same = headers.every(function(h, i){ return existingHeaders[i] === h; }) && existingHeaders.slice(headers.length).every(function(h){ return !h; });
  if (same) return;

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }

  const values = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  const oldIndex = {};
  existingHeaders.forEach(function(h, i){ if (h) oldIndex[h.toLowerCase()] = i; });

  const hasOldRentalItemsSortOrder = existingHeaders[0] === 'Rental Item' && existingHeaders[1] === 'Icon' && existingHeaders[2] === 'Active' && existingHeaders[3] === 'Custom' && existingHeaders[4] === 'SortOrder' && existingHeaders.indexOf('Sizes') === -1;
  const hasBrokenRentalSizeLayout = existingHeaders[0] === 'Rental Item' && existingHeaders[1] === 'Size' && existingHeaders[2] === 'Icon' && existingHeaders[3] === 'Active' && existingHeaders[4] === 'Custom' && existingHeaders[5] === 'SortOrder';

  const newRows = values.map(function(row, rowNumber){
    if (hasBrokenRentalSizeLayout && headers.join('|') === 'Rental Item|Icon|Active|Custom|Sizes|SortOrder') {
      const sizeOrIcon = String(row[1] || '').trim();
      const iconCell = String(row[2] || '').trim();
      const activeCell = row[3];
      const customCell = row[4];
      const sortCell = row[5] || row[4] || rowNumber + 1;
      const activeLooksLikeBoolean = String(activeCell).toLowerCase() === 'true' || String(activeCell).toLowerCase() === 'false' || activeCell === true || activeCell === false;
      const sizeColumnActuallyHasIcon = sizeOrIcon.indexOf('icons/') === 0 || sizeOrIcon === '➕' || sizeOrIcon.indexOf('.png') !== -1;
      return [
        row[0] || '',
        sizeColumnActuallyHasIcon ? sizeOrIcon : (iconCell || '📦'),
        activeLooksLikeBoolean ? activeCell : row[2],
        activeLooksLikeBoolean ? customCell : row[3],
        sizeColumnActuallyHasIcon ? '' : sizeOrIcon,
        sortCell
      ];
    }

    return headers.map(function(header, newIndex){
      const key = header.toLowerCase();
      if (oldIndex[key] !== undefined) return row[oldIndex[key]];
      if (header === 'Sizes') return oldIndex['size'] !== undefined ? row[oldIndex['size']] : '';
      if (hasOldRentalItemsSortOrder && header === 'SortOrder') return row[4] || rowNumber + 1;
      return '';
    });
  });

  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (newRows.length) sheet.getRange(2, 1, newRows.length, headers.length).setValues(newRows);
}

function seedRentalItemsIfEmpty_() {
  const sheet = getRentalItemsSheet_();
  if (sheet.getLastRow() > 1) return;
  const rows = [
    ["Conex", "🚚", true, false, "", 1],
    ["Lull", "🚜", true, false, "6k, 8k, 10k, 12k", 2],
    ["Scissor Lift", "↕️", true, false, "19 ft, 26 ft, 32 ft, 40 ft", 3],
    ["Boom Lift", "🏗️", true, false, "45 ft, 60 ft, 80 ft, 125 ft", 4],
    ["Porta John", "🚻", true, false, "", 5],
    ["Other / Custom", "➕", true, true, "", 6]
  ];
  sheet.getRange(2, 1, rows.length, 6).setValues(rows);
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
      options: String(row[4] || "").split(",").map(function(part){ return part.trim(); }).filter(Boolean),
      sortOrder: row[5] || index + 1
    }))
    .sort((a, b) => Number(a.sortOrder || 999999) - Number(b.sortOrder || 999999));
}

function saveRentalItems_(items) {
  const sheet = getRentalItemsSheet_();
  const header = ["Rental Item", "Icon", "Active", "Custom", "Sizes", "SortOrder"];
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
      Array.isArray(item.options) ? item.options.join(", ") : String(item.options || item.sizes || item.Sizes || ""),
      item.sortOrder || rows.length
    ]);
  });

  if (!seen["other / custom"]) rows.push(["Other / Custom", "➕", true, true, "", rows.length]);

  sheet.clear();
  sheet.getRange(1, 1, rows.length, header.length).setValues(rows);
}


function getRentalsSheet_() {
  const headers = ["Date Added", "Job", "Rental Item", "Size", "Quantity", "Status", "Requested By", "Vendor", "Notes", "Date Off Rent"];
  const sheet = getOrCreateSheet_(RENTALS_SHEET_NAME, headers);
  migrateSheetHeaders_(sheet, headers);
  return sheet;
}

function getRentals_() {
  const sheet = getRentalsSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  const header = values.shift().map(function(h){ return String(h || "").trim().toLowerCase(); });
  const hasSizeColumn = header.indexOf("size") !== -1;
  return values.filter(row => row[1] || row[2]).map((row, index) => ({
    id: index + 2,
    dateAdded: row[0],
    job: String(row[1] || ""),
    rentalItem: String(row[2] || ""),
    rentalSize: hasSizeColumn ? String(row[3] || "") : "",
    quantity: hasSizeColumn ? (row[4] || 1) : (row[3] || 1),
    status: String(hasSizeColumn ? (row[5] || "Active") : (row[4] || "Active")),
    requestedBy: String(hasSizeColumn ? (row[6] || "") : (row[5] || "")),
    vendor: String(hasSizeColumn ? (row[7] || "") : (row[6] || "")),
    notes: String(hasSizeColumn ? (row[8] || "") : (row[7] || "")),
    dateOffRent: (hasSizeColumn ? row[9] : row[8]) ? Utilities.formatDate(new Date(hasSizeColumn ? row[9] : row[8]), Session.getScriptTimeZone(), "yyyy-MM-dd") : ""
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

function getPdfLetterheadSheet_() {
  return getOrCreateSheet_(PDF_LETTERHEAD_SHEET_NAME, ["Setting", "Value"]);
}

function defaultPdfLetterheadValues_() {
  return {
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
    footerMessage: "Thank you for using the Material Order App!",
    previewHeading: "AC General Material Order PDF"
  };
}

function getPdfLetterhead_() {
  const sheet = getPdfLetterheadSheet_();
  const defaults = defaultPdfLetterheadValues_();
  if (sheet.getLastRow() < 2) savePdfLetterhead_(defaults);
  const values = sheet.getDataRange().getValues();
  const out = Object.assign({}, defaults);
  for (let i = 1; i < values.length; i++) {
    const key = String(values[i][0] || "").trim();
    if (key) out[key] = values[i][1] || "";
  }
  return out;
}

function savePdfLetterhead_(pdf) {
  const sheet = getPdfLetterheadSheet_();
  const merged = Object.assign({}, defaultPdfLetterheadValues_(), pdf || {});
  const keys = ["leftLogo", "rightLogo", "titleLine1", "titleLine2", "address", "phoneFax", "website", "license", "previewHeading", "companyName", "documentTitle", "footerMessage"];
  sheet.clearContents();
  sheet.appendRow(["Setting", "Value"]);
  const rows = keys.map(key => [key, merged[key] || ""]);
  if (rows.length) sheet.getRange(2, 1, rows.length, 2).setValues(rows);
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
  const letter = defaultedLetterhead_(Object.assign({}, getPdfLetterhead_(), data.pdfLetterhead || {}));
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
  const letter = defaultedLetterhead_(Object.assign({}, getPdfLetterhead_(), data.pdfLetterhead || {}));
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


function getMaterialCategoriesSheet_() {
  return getOrCreateSheet_(MATERIAL_CATEGORIES_SHEET_NAME, ["Category", "Category Label","Notes Enabled", "Active", "SortOrder"]);
}

function getMaterialCategories_() {
  const sheet = getMaterialCategoriesSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const headers = values.shift().map(h => String(h || "").trim());
  const seen = {};

  return values
    .filter(row => row.some(cell => String(cell || "").trim() !== ""))
    .map(row => {
      const object = {};
      headers.forEach((header, index) => object[header] = row[index]);
      return {
        category: String(object["Category"] || "").trim(),
        categoryLabel: String(object["Category Label"] || object["Category"] || "").trim(),
        active: object["Active"] === "" ? true : object["Active"],
        sortOrder: object["SortOrder"] || ""
      };
    })
    .filter(item => {
      const key = String(item.category || "").trim().toLowerCase();
      if (!key || seen[key]) return false;
      seen[key] = true;
      const activeValue = String(item.active).trim().toLowerCase();
      return !(activeValue === "false" || activeValue === "no" || activeValue === "0" || activeValue === "inactive");
    })
    .sort((a, b) => Number(a.sortOrder || 999999) - Number(b.sortOrder || 999999));
}

function saveMaterialCategories_(categories) {
  const sheet = getMaterialCategoriesSheet_();
  const header = ["Category", "Category Label","Notes Enabled", "Active", "SortOrder"];
  const rows = [header];
  const seen = {};

  (categories || []).forEach((item, index) => {
    const category = String(item.Category || item.category || "").trim();
    const label = String(item["Category Label"] || item.categoryLabel || item.label || category).trim();
    const key = category.toLowerCase();

    if (!category || seen[key]) return;
    seen[key] = true;

    rows.push([
      category,
      label || category,
      item.Active === undefined && item.active === undefined ? true : (item.Active !== undefined ? item.Active : item.active),
      item.SortOrder || item.sortOrder || index + 1
    ]);
  });

  sheet.clear();
  sheet.getRange(1, 1, rows.length, header.length).setValues(rows);
}

function getMaterialsSheet_() {
  return getOrCreateSheet_(MATERIALS_SHEET_NAME, ["Category", "Category Label", "Material", "Icon", "Options", "Units", "Notes Enabled", "Active", "SortOrder"]);
}

function saveMaterials_(materials) {
  const sheet = getMaterialsSheet_();
  const header = ["Category", "Category Label", "Material", "Icon", "Options", "Units", "Notes Enabled", "Active", "SortOrder"];
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
      item["Notes Enabled"] !== undefined ? item["Notes Enabled"] : (item.notesEnabled === true),
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
        notesEnabled:
  object["Notes Enabled"] === true ||
  String(object["Notes Enabled"] || "").toLowerCase() === "true",
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


function getProjectPermitsSheet_() {
  const headers = [
    "ID",
    "Job",
    "Permit Pulled",
    "Permit Number",
    "Permit Date",
    "Notes",
    "Created By",
    "Created Date",
    "Updated By",
    "Updated Date"
  ];
  const sheet = getOrCreateSheet_(PROJECT_PERMITS_SHEET_NAME, headers);
  migrateProjectPermitsSheet_(sheet, headers);
  return sheet;
}

function migrateProjectPermitsSheet_(sheet, headers) {
  const lastCol = Math.max(sheet.getLastColumn(), headers.length);
  const existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h || "").trim());
  if (existingHeaders.slice(0, headers.length).join("|") === headers.join("|")) return;

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    sheet.clearContents();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }

  const values = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  const oldIndex = {};
  existingHeaders.forEach((h, i) => { if (h) oldIndex[h.toLowerCase()] = i; });

  const rows = values
    .filter(row => row.some(cell => String(cell || "").trim() !== ""))
    .map((row, index) => {
      const id = getOldProjectPermitCell_(row, oldIndex, "id") || makeProjectPermitId_();
      const job = getOldProjectPermitCell_(row, oldIndex, "job");
      const permitPulled = getOldProjectPermitCell_(row, oldIndex, "permit pulled");
      const permitNumber = getOldProjectPermitCell_(row, oldIndex, "permit number");
      const permitDate = getOldProjectPermitCell_(row, oldIndex, "permit date");
      const notes = getOldProjectPermitCell_(row, oldIndex, "notes");
      const createdBy = getOldProjectPermitCell_(row, oldIndex, "created by") || getOldProjectPermitCell_(row, oldIndex, "updated by");
      const createdDate = getOldProjectPermitCell_(row, oldIndex, "created date") || getOldProjectPermitCell_(row, oldIndex, "updated date") || new Date();
      const updatedBy = getOldProjectPermitCell_(row, oldIndex, "updated by");
      const updatedDate = getOldProjectPermitCell_(row, oldIndex, "updated date") || new Date();
      return [id, job, permitPulled, permitNumber, permitDate, notes, createdBy, createdDate, updatedBy, updatedDate];
    });

  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (rows.length) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function getOldProjectPermitCell_(row, oldIndex, key) {
  if (oldIndex[key] !== undefined) return row[oldIndex[key]];
  return "";
}

function makeProjectPermitId_() {
  return "PERMIT-" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMddHHmmss") + "-" + Math.floor(1000 + Math.random() * 9000);
}

function normalizeProjectPermitBool_(value) {
  if (value === true) return true;
  if (value === false) return false;
  const text = String(value || "").trim().toLowerCase();
  return text === "true" || text === "yes" || text === "1" || text === "checked" || text === "pulled";
}

function formatProjectPermitDate_(value) {
  if (!value) return "";
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value)) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return String(value || "").trim();
}

function projectPermitObjectFromRow_(headers, row) {
  const object = {};
  headers.forEach((header, index) => object[header] = row[index]);
  return {
    id: String(object["ID"] || ""),
    job: String(object["Job"] || ""),
    permitPulled: normalizeProjectPermitBool_(object["Permit Pulled"]),
    permitNumber: String(object["Permit Number"] || ""),
    permitDate: formatProjectPermitDate_(object["Permit Date"]),
    notes: String(object["Notes"] || ""),
    createdBy: String(object["Created By"] || ""),
    createdDate: formatProjectPermitDate_(object["Created Date"]),
    updatedBy: String(object["Updated By"] || ""),
    updatedDate: formatProjectPermitDate_(object["Updated Date"])
  };
}

function getProjectPermits_(jobName) {
  const job = String(jobName || "").trim();
  if (!job) return [];

  const sheet = getProjectPermitsSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const headers = values[0].map(h => String(h || "").trim());
  return values.slice(1)
    .filter(row => String(row[1] || "").trim().toLowerCase() === job.toLowerCase())
    .map(row => projectPermitObjectFromRow_(headers, row))
    .sort((a, b) => String(b.updatedDate || b.createdDate || "").localeCompare(String(a.updatedDate || a.createdDate || "")));
}

// Backwards-compatible single permit loader.
function getProjectPermit_(jobName) {
  const permits = getProjectPermits_(jobName);
  return permits[0] || {
    id: "",
    job: String(jobName || "").trim(),
    permitPulled: false,
    permitNumber: "",
    permitDate: "",
    notes: "",
    createdBy: "",
    createdDate: "",
    updatedBy: "",
    updatedDate: ""
  };
}

function saveProjectPermit_(data) {
  const sheet = getProjectPermitsSheet_();
  const job = String(data.job || "").trim();
  if (!job) throw new Error("Project Permit requires a Job.");

  const id = String(data.id || "").trim() || makeProjectPermitId_();
  const now = new Date();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(h => String(h || "").trim());
  const values = sheet.getDataRange().getValues();

  let existingCreatedBy = data.updatedBy || "";
  let existingCreatedDate = now;
  let rowToUpdate = 0;

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0] || "").trim() === id) {
      rowToUpdate = i + 1;
      existingCreatedBy = values[i][6] || existingCreatedBy;
      existingCreatedDate = values[i][7] || existingCreatedDate;
      break;
    }
  }

  const rowValues = [
    id,
    job,
    data.permitPulled === true || String(data.permitPulled || "").toLowerCase() === "true",
    data.permitNumber || "",
    data.permitDate || "",
    data.notes || "",
    existingCreatedBy,
    existingCreatedDate,
    data.updatedBy || "",
    now
  ];

  if (rowToUpdate) {
    sheet.getRange(rowToUpdate, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return projectPermitObjectFromRow_(headers, rowValues);
}

function deleteProjectPermit_(id) {
  id = String(id || "").trim();
  if (!id) return;

  const sheet = getProjectPermitsSheet_();
  const values = sheet.getDataRange().getValues();
  for (let i = values.length - 1; i >= 1; i--) {
    if (String(values[i][0] || "").trim() === id) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
}


function json_(object) { return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(ContentService.MimeType.JSON); }

function testEmailPermission() {
  MailApp.sendEmail({ to: "popmods@gmail.com", subject: "Material Order App Email Test", body: "Email permission is working." });
}
function sendEstimatingEmail_(data) {
  const to = String(data.toEmail || "").trim();
  const cc = String(data.cc || "").trim();
  const bcc = String(data.bcc || "").trim();

  if (!to && !bcc) {
    throw new Error("Estimating email needs a Send To or BCC recipient.");
  }

  const jobName = String(data.jobName || "").trim();
  const bidDate = String(data.bidDate || "").trim();
  const downloadLink = String(data.downloadLink || "").trim();
  const heading = String(data.heading || "AC General BID Opportunity").trim();
  const senderName = String(data.senderName || "AC General Estimating").trim();
  const quoteContact = String(data.quoteContact || "Nicholas Mcdonald – nmcdonald@acgeneral.net").trim();

  const subject = heading + " - " + jobName + " - " + bidDate;

  const plainBody =
    heading + "\n\n" +
    jobName + "\n" +
    bidDate + "\n\n" +
    "Please click here to download the file for the job referenced above:\n" +
    downloadLink + "\n\n" +
    "Please send your quotes to:\n" +
    quoteContact;

  const htmlBody =
    "<div style='font-family:Arial,sans-serif;max-width:720px;margin:0 auto;color:#111827;'>" +
      "<h1 style='color:#0f172a;margin-bottom:6px;'>" + escapeHtml_(heading) + "</h1>" +
      "<h2 style='margin:0 0 8px;color:#1f2937;'>" + escapeHtml_(jobName) + "</h2>" +
      "<p style='font-size:16px;margin:0 0 18px;'><strong>Bid Date:</strong> " + escapeHtml_(bidDate) + "</p>" +
      "<p style='font-size:16px;'>Please click below to download the file for the job referenced above.</p>" +
      "<p style='margin:24px 0;'>" +
        "<a href='" + escapeHtml_(downloadLink) + "' style='background:#f97316;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:8px;font-weight:bold;display:inline-block;'>Click Here To Download</a>" +
      "</p>" +
      "<hr style='border:0;border-top:1px solid #e5e7eb;margin:24px 0;' />" +
      "<p style='font-size:16px;'><strong>Please send your quotes to:</strong><br>" + escapeHtml_(quoteContact) + "</p>" +
    "</div>";

  const options = {
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody,
    name: senderName
  };

  if (to) options.to = to;
  if (cc) options.cc = cc;
  if (bcc) options.bcc = bcc;

  MailApp.sendEmail(options);
}
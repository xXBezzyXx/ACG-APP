(function () {
  const STORAGE_KEY = "fieldOpsLanguage";
  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "SELECT"]);

  const dictionary = {
    "Material Ordering": "Pedido de Materiales",
    "Jobs": "Trabajos",
    "Search jobs": "Buscar trabajos",
    "Select Action": "Seleccionar Acción",
    "Selected Job": "Trabajo Seleccionado",
    "Active": "Activo",
    "Daily Report": "Reporte Diario",
    "Manpower, work performed, issues, photos": "Mano de obra, trabajo realizado, problemas, fotos",
    "Material Order": "Orden de Material",
    "Request materials and email PDF": "Solicitar materiales y enviar PDF por correo",
    "Job Site Rentals": "Rentas del Sitio",
    "Track conex, lull, lifts, and rental quantity": "Controlar conex, lull, elevadores y cantidad de renta",
    "Project Tracker": "Seguimiento del Proyecto",
    "Submittals, permits, ODPs, releases, notes": "Submittals, permisos, ODPs, liberaciones, notas",
    "Operations Manager Only": "Solo Gerente de Operaciones",
    "Choose what you want to track for this job.": "Elija lo que quiere controlar para este trabajo.",
    "Permits": "Permisos",
    "Permit pulled, permit notes, status": "Permiso obtenido, notas del permiso, estado",
    "Subcontractors": "Subcontratistas",
    "Subs, contracts, scope notes": "Subs, contratos, notas de alcance",
    "Submittals": "Submittals",
    "Required, sent, approved, rejected": "Requerido, enviado, aprobado, rechazado",
    "ODPs": "ODPs",
    "ODP paperwork and status": "Papeles ODP y estado",
    "Equipment Release": "Liberación de Equipo",
    "Louvers, equipment, long lead items": "Louvers, equipo, materiales de largo plazo",
    "Notes": "Notas",
    "Lead times and project notes": "Tiempos de entrega y notas del proyecto",
    "+ Add Permit": "+ Agregar Permiso",
    "+ Add Subcontractor": "+ Agregar Subcontratista",
    "+ Add Submittal": "+ Agregar Submittal",
    "Add / Edit Permit": "Agregar / Editar Permiso",
    "Add / Edit Subcontractor": "Agregar / Editar Subcontratista",
    "Add / Edit Submittal": "Agregar / Editar Submittal",
    "Permit Pulled": "Permiso Obtenido",
    "Permit Number": "Número de Permiso",
    "Permit Date": "Fecha del Permiso",
    "Permit Notes": "Notas del Permiso",
    "Save Permit": "Guardar Permiso",
    "Save Subcontractor": "Guardar Subcontratista",
    "Save Submittal": "Guardar Submittal",
    "Cancel": "Cancelar",
    "No permits added yet.": "Todavía no se han agregado permisos.",
    "No subcontractors added yet.": "Todavía no se han agregado subcontratistas.",
    "No submittals added yet.": "Todavía no se han agregado submittals.",
    "Subcontractor Name": "Nombre del Subcontratista",
    "Scope": "Alcance",
    "Contract Amount": "Monto del Contrato",
    "Contract Sent": "Contrato Enviado",
    "Contract Returned": "Contrato Devuelto",
    "Executed": "Ejecutado",
    "Submittal Name": "Nombre del Submittal",
    "Spec Section": "Sección de Especificación",
    "Vendor": "Proveedor",
    "Requested From Vendor": "Solicitado al Proveedor",
    "Requested Date": "Fecha Solicitada",
    "Received From Vendor": "Recibido del Proveedor",
    "Received Date": "Fecha Recibida",
    "Submitted To Engineer": "Enviado al Ingeniero",
    "Submitted Date": "Fecha Enviada",
    "Approved": "Aprobado",
    "Approved Date": "Fecha Aprobada",
    "Rejected": "Rechazado",
    "Rejected Date": "Fecha Rechazada",
    "Resubmitted": "Reenviado",
    "Resubmitted Date": "Fecha Reenviada",
    "All": "Todos",
    "Job Site Rental": "Renta del Sitio",
    "Manpower Board": "Tablero de Mano de Obra",
    "New Order": "Nueva Orden",
    "Select Job": "Seleccionar Trabajo",
    "Select Material": "Seleccionar Material",
    "Search material": "Buscar material",
    "Cart": "Carrito",
    "Nothing added yet.": "Nada agregado todavía.",
    "Requested by your login": "Solicitado por su usuario",
    "Additional Notes": "Notas Adicionales",
    "Review Order": "Revisar Orden",
    "Add Priority": "Agregar Prioridad",
    "Normal": "Normal",
    "Rush": "Urgente",
    "Emergency": "Emergencia",
    "Items Requested": "Materiales Solicitados",
    "None": "Ninguno",
    "Total Items": "Total de Materiales",
    "Submit Order": "Enviar Orden",
    "This sends a branded PDF material form to the job contact.": "Esto envía un formulario PDF de materiales al contacto del trabajo.",
    "Submit Daily Report": "Enviar Reporte Diario",
    "This creates an emailed Daily Report PDF. Photos are included in the PDF only.": "Esto crea un PDF de reporte diario enviado por correo. Las fotos se incluyen solo en el PDF.",
    "Photos for PDF — Max 6": "Fotos para PDF — Máximo 6",
    "No photos selected.": "No hay fotos seleccionadas.",
    "Go To Cart ↓": "Ir al Carrito ↓",
    "Back To Top ↑": "Volver Arriba ↑",
    "Add to Cart": "Agregar al Carrito",
    "Size": "Tamaño",
    "Unit": "Unidad",
    "Material Needed": "Material Necesario",
    "Notes (Required)": "Notas (Requerido)",
    "Hanging Material": "Material para Colgar",
    "Fasteners": "Tornillería",
    "Duct Material": "Material de Ducto",
    "Pipe & Fittings": "Tubería y Accesorios",
    "Tools & Consumables": "Herramientas y Consumibles",
    "Orders": "Órdenes",
    "Rentals": "Rentas",
    "Manpower": "Mano de Obra",
    "Operations": "Operaciones",
    "Admin": "Administrador",
    "Material order ready": "Orden de material lista",

    "● Active": "● Activo",

    "DCPS Spring Park": "DCPS Parque Spring",
    "UF Jax Bay Street": "UF Jax Calle Bay",
    "FSDB": "FSDB",
    "NE Park": "Parque NE",
    "SMA": "SMA",
    "RR": "RR",
    "Other Job": "Otro Trabajo",

    "Nuts": "Tuercas",
    "Bolts": "Pernos",
    "Washers": "Arandelas",
    "All Thread": "Varilla Roscada",
    "Unistrut": "Unistrut",
    "Beam Clamps": "Abrazaderas de Viga",
    "Self Tapping Screws": "Tornillos Autorroscantes",
    "Tapcons": "Tapcons",
    "Anchors": "Anclajes",
    "Fender Washers": "Arandelas Grandes",
    "Duct Seal": "Sellador de Ducto",
    "Foil Tape": "Cinta de Foil",
    "Flex Duct": "Ducto Flexible",
    "Duct Wrap": "Aislamiento de Ducto",
    "Drive Cleat": "Drive Cleat",
    "S-Lock": "S-Lock",
    "Pittsburgh": "Pittsburgh",
    "Hanger Strap": "Cinta Colgante",
    "Copper Pipe": "Tubo de Cobre",
    "PVC Pipe": "Tubo PVC",
    "Pipe Insulation": "Aislamiento de Tubería",
    "PVC Glue": "Pegamento PVC",
    "Primer": "Primer",
    "Pipe Clamps": "Abrazaderas de Tubería",
    "Pins": "Pines",
    "Shots": "Cargas",
    "Sawzall Blades": "Hojas de Sawzall",
    "Drill Bits": "Brocas",
    "Hole Saws": "Sierras Copa",
    "Blue Wrap": "Plástico Azul",
    "Gloves": "Guantes",
    "Safety Glasses": "Lentes de Seguridad",

    "Box": "Caja",
    "Each": "Cada Uno",
    "Bundle": "Paquete",
    "Stick": "Tramo",
    "Bucket": "Cubeta",
    "Pallet": "Pallet",
    "Roll": "Rollo",
    "Can": "Lata",
    "Pair": "Par",
    "Pack": "Paquete",
    "Metal": "Metal",
    "Demo": "Demolición",
    "Fine Tooth": "Diente Fino",
    "Green": "Verde",
    "Yellow": "Amarillo",
    "Red": "Rojo"
  };

  const reverseDictionary = Object.fromEntries(Object.entries(dictionary).map(([en, es]) => [es, en]));


  const phraseDictionary = {
    "Hangers & Supports": "Soportes y Colgadores",
    "Hanging Strap": "Cinta Colgante",
    "Duct Hanging Strap": "Cinta Colgante para Ducto",
    "Hangers": "Colgadores",
    "Supports": "Soportes",
    "Hardware": "Tornillería",
    "Parks": "Parques",
    "Park": "Parque",
    "Sportsplex": "Complejo Deportivo",
    "Sportplex": "Complejo Deportivo",
    "Community": "Comunidad",
    "Center": "Centro",
    "Central": "Central",
    "Elementary School": "Escuela Primaria",
    "School": "Escuela",
    "Street": "Calle",
    "Bay Street": "Calle Bay",
    "Spring": "Spring",
    "North East": "Noreste",
    "North": "Norte",
    "South": "Sur",
    "East": "Este",
    "West": "Oeste",
    "Building": "Edificio",
    "Buildings": "Edificios",
    "County": "Condado",
    "Permit Center": "Centro de Permisos",
    "Field": "Campo",
    "Fields": "Campos",
    "Gym": "Gimnasio",
    "Gymnasium": "Gimnasio",
    "Classroom": "Aula",
    "Classrooms": "Aulas",
    "Office": "Oficina",
    "Offices": "Oficinas",
    "Library": "Biblioteca",
    "Kitchen": "Cocina",
    "Cafeteria": "Cafetería",
    "Mechanical": "Mecánico",
    "Electrical": "Eléctrico",
    "Plumbing": "Plomería",
    "Renovation": "Renovación",
    "Addition": "Adición",
    "Phase": "Fase",

    "Duct": "Ducto",
    "Pipe": "Tubería",
    "Piping": "Tubería",
    "Fittings": "Accesorios",
    "Fitting": "Accesorio",
    "Copper": "Cobre",
    "PVC": "PVC",
    "Insulation": "Aislamiento",
    "Glue": "Pegamento",
    "Primer": "Primer",
    "Clamp": "Abrazadera",
    "Clamps": "Abrazaderas",
    "Strap": "Cinta",
    "Straps": "Cintas",
    "Hanger": "Colgador",
    "Support": "Soporte",
    "Material": "Material",
    "Materials": "Materiales",
    "Tool": "Herramienta",
    "Tools": "Herramientas",
    "Consumables": "Consumibles",
    "Fasteners": "Tornillería",
    "Fastener": "Tornillo",
    "Screw": "Tornillo",
    "Screws": "Tornillos",
    "Self Tapping": "Autorroscantes",
    "Self-Drilling": "Autoperforante",
    "Washer": "Arandela",
    "Washers": "Arandelas",
    "Nut": "Tuerca",
    "Nuts": "Tuercas",
    "Bolt": "Perno",
    "Bolts": "Pernos",
    "Anchor": "Anclaje",
    "Anchors": "Anclajes",
    "Beam": "Viga",
    "Cleat": "Cleat",
    "Seal": "Sellador",
    "Tape": "Cinta",
    "Foil": "Foil",
    "Flex": "Flexible",
    "Wrap": "Aislamiento",
    "Blue": "Azul",
    "Gloves": "Guantes",
    "Safety": "Seguridad",
    "Glasses": "Lentes",
    "Blade": "Hoja",
    "Blades": "Hojas",
    "Drill": "Taladro",
    "Bits": "Brocas",
    "Bit": "Broca",
    "Hole Saw": "Sierra Copa",
    "Hole Saws": "Sierras Copa",
    "Pins": "Pines",
    "Pin": "Pin",
    "Shots": "Cargas",
    "Shot": "Carga",
    "Metal": "Metal",
    "Demo": "Demolición",
    "Fine Tooth": "Diente Fino",

    "Select": "Seleccionar",
    "Search": "Buscar",
    "Order": "Orden",
    "Orders": "Órdenes",
    "Rental": "Renta",
    "Rentals": "Rentas",
    "Report": "Reporte",
    "Daily": "Diario",
    "Project": "Proyecto",
    "Tracker": "Seguimiento",
    "Add": "Agregar",
    "Save": "Guardar",
    "Cancel": "Cancelar",
    "Submit": "Enviar",
    "Review": "Revisar",
    "Cart": "Carrito",
    "Quantity": "Cantidad",
    "Qty": "Cant.",
    "Size": "Tamaño",
    "Unit": "Unidad",
    "Notes": "Notas",
    "Note": "Nota",
    "Required": "Requerido",
    "Active": "Activo"
  };

  const reversePhraseDictionary = Object.fromEntries(Object.entries(phraseDictionary).map(([en, es]) => [es, en]));

  function escapeRegExp(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function smartTranslate(value, lang) {
    if (!value) return value;
    const original = String(value);
    const trimmed = original.trim();
    const leading = original.match(/^\s*/)[0];
    const trailing = original.match(/\s*$/)[0];
    const exactMap = lang === "es" ? dictionary : reverseDictionary;
    if (Object.prototype.hasOwnProperty.call(exactMap, trimmed)) return leading + exactMap[trimmed] + trailing;

    const phraseMap = lang === "es" ? phraseDictionary : reversePhraseDictionary;
    let translated = trimmed;
    Object.entries(phraseMap)
      .sort((a, b) => b[0].length - a[0].length)
      .forEach(([from, to]) => {
        const re = new RegExp("\\b" + escapeRegExp(from) + "\\b", "gi");
        translated = translated.replace(re, to);
      });

    if (lang === "es") {
      translated = translated
        .replace(/\s*&\s*/g, " y ")
        .replace(/\s+and\s+/gi, " y ")
        .replace(/\s+of\s+/gi, " de ")
        .replace(/\s+for\s+/gi, " para ")
        .replace(/\s+to\s+/gi, " a ");
    } else {
      translated = translated
        .replace(/\s+y\s+/gi, " & ")
        .replace(/\s+de\s+/gi, " of ")
        .replace(/\s+para\s+/gi, " for ");
    }

    return leading + translated + trailing;
  }

  function getLanguage() {
    return localStorage.getItem(STORAGE_KEY) || "en";
  }

  function setLanguage(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function translateString(value, lang) {
    return smartTranslate(value, lang);
  }

  function translateTextNodes(root, lang) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      node.nodeValue = translateString(node.nodeValue, lang);
    });
  }

  function translateAttributes(lang) {
    document.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(el => {
      el.placeholder = translateString(el.placeholder, lang);
    });
    document.querySelectorAll("button[value], input[value]").forEach(el => {
      if ((el.type || "").toLowerCase() !== "hidden") el.value = translateString(el.value, lang);
    });
  }

  function ensureLanguageButton() {
    let btn = document.getElementById("fieldOpsLanguageToggle");
    if (btn) return btn;

    btn = document.createElement("button");
    btn.id = "fieldOpsLanguageToggle";
    btn.className = "fieldops-language-toggle";
    btn.type = "button";
    document.body.appendChild(btn);
    return btn;
  }

  function updateLanguageButton(lang) {
    const btn = ensureLanguageButton();
    btn.textContent = lang === "es" ? "English" : "Español";
    btn.setAttribute("aria-label", lang === "es" ? "Switch to English" : "Cambiar a Español");
  }

  function applyLanguage() {
    const lang = getLanguage();
    translateTextNodes(document.body, lang);
    translateAttributes(lang);
    updateLanguageButton(lang);
    document.documentElement.lang = lang;
  }

  let applying = false;
  let timer = null;
  function scheduleApply() {
    if (applying) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      applying = true;
      applyLanguage();
      applying = false;
    }, 50);
  }

  function initLanguageToggle() {
    const btn = ensureLanguageButton();
    if (btn && !btn.dataset.ready) {
      btn.dataset.ready = "true";
      btn.addEventListener("click", () => {
        const next = getLanguage() === "es" ? "en" : "es";
        setLanguage(next);
        applyLanguage();
      });
    }

    applyLanguage();

    const observer = new MutationObserver(scheduleApply);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLanguageToggle);
  } else {
    initLanguageToggle();
  }

  window.applyFieldOpsLanguage = applyLanguage;
})();

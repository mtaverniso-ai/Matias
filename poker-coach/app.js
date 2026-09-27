import Anthropic from "https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.128.0/+esm";
import { PLANTILLA_ESTRATEGIA } from "./estrategia-plantilla.js";

const $ = (id) => document.getElementById(id);

// ---------- almacenamiento local ----------
const KEYS = {
  apiKey: "pc.apiKey",
  modelo: "pc.modelo",
  effort: "pc.effort",
  estrategia: "pc.estrategia",
  historial: "pc.historial",
};
const MAX_HISTORIAL = 100;

function leer(key, def = null) {
  try { return localStorage.getItem(key) ?? def; } catch { return def; }
}
function guardar(key, value) {
  try { localStorage.setItem(key, value); return true; } catch { return false; }
}
function leerHistorial() {
  try { return JSON.parse(leer(KEYS.historial, "[]")); } catch { return []; }
}

function setEstado(el, texto, error = false) {
  el.textContent = texto;
  el.classList.toggle("error", error);
}

// ---------- pestañas ----------
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b === btn));
    document.querySelectorAll(".panel").forEach((p) =>
      p.classList.toggle("active", p.id === `tab-${btn.dataset.tab}`));
    if (btn.dataset.tab === "historial") renderHistorial();
  });
});

// ---------- ajustes ----------
$("api-key").value = leer(KEYS.apiKey, "");
$("modelo").value = leer(KEYS.modelo, "claude-opus-5");
$("effort").value = leer(KEYS.effort, "low");

$("btn-guardar-ajustes").addEventListener("click", () => {
  const ok = guardar(KEYS.apiKey, $("api-key").value.trim())
    && guardar(KEYS.modelo, $("modelo").value)
    && guardar(KEYS.effort, $("effort").value);
  setEstado($("estado-ajustes"), ok ? "Ajustes guardados." : "No se pudo guardar (¿navegación privada?).", !ok);
});

// ---------- estrategia ----------
$("estrategia").value = leer(KEYS.estrategia, PLANTILLA_ESTRATEGIA);

$("btn-guardar-estrategia").addEventListener("click", () => {
  const ok = guardar(KEYS.estrategia, $("estrategia").value);
  setEstado($("estado-estrategia"), ok ? "Estrategia guardada." : "No se pudo guardar.", !ok);
});
$("btn-plantilla").addEventListener("click", () => {
  if (confirm("¿Reemplazar tu texto actual por la estrategia de tus clases (Poker_v4)?")) {
    $("estrategia").value = PLANTILLA_ESTRATEGIA;
  }
});
$("btn-exportar-estrategia").addEventListener("click", () =>
  descargar("mi-estrategia-poker.txt", $("estrategia").value, "text/plain"));
$("input-estrategia").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  e.target.value = "";
  try {
    $("estrategia").value = /\.xlsx?$/i.test(file.name) ? await excelATexto(file) : await file.text();
    setEstado($("estado-estrategia"), `Importado "${file.name}". Revisalo y tocá Guardar para conservarlo.`);
  } catch (err) {
    setEstado($("estado-estrategia"), `No se pudo leer "${file.name}": ${err.message}`, true);
  }
});

// Convierte todas las hojas de un Excel en texto: una sección por hoja, una línea por fila.
async function excelATexto(file) {
  const XLSX = await import("https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs");
  const wb = XLSX.read(await file.arrayBuffer());
  const hojas = wb.SheetNames.map((nombre) => {
    const filas = XLSX.utils.sheet_to_json(wb.Sheets[nombre], { header: 1, raw: false, defval: "" })
      .map((fila) => fila.map((c) => String(c).trim()).filter(Boolean).join(" | "))
      .filter(Boolean);
    return filas.length ? `## ${nombre}\n${filas.join("\n")}` : "";
  }).filter(Boolean);
  if (!hojas.length) throw new Error("el archivo no tiene texto");
  return `# MI ESTRATEGIA (importada de ${file.name})\n\n${hojas.join("\n\n")}`;
}

function descargar(nombre, contenido, tipo) {
  const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  const a = Object.assign(document.createElement("a"), { href: url, download: nombre });
  a.click();
  URL.revokeObjectURL(url);
}

// ---------- cámara ----------
const video = $("video");
const foto = $("foto");
let stream = null;
let facingMode = "environment";
let fotoSubida = null; // dataURL de una foto subida manualmente

async function encenderCamara() {
  apagarCamara();
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: false,
    });
  } catch (err) {
    setEstado($("estado"), `No se pudo abrir la cámara: ${err.message}. ` +
      "Revisá los permisos y que la página se abra por https.", true);
    return;
  }
  video.srcObject = stream;
  fotoSubida = null;
  foto.hidden = true;
  video.hidden = false;
  $("camara-vacia").hidden = true;
  $("btn-camara").textContent = "⏹️ Apagar cámara";
  $("btn-girar").disabled = false;
}

function apagarCamara() {
  stream?.getTracks().forEach((t) => t.stop());
  stream = null;
  video.srcObject = null;
  $("btn-camara").textContent = "📷 Encender cámara";
  $("btn-girar").disabled = true;
  if (!fotoSubida) $("camara-vacia").hidden = false;
}

$("btn-camara").addEventListener("click", () => (stream ? apagarCamara() : encenderCamara()));
$("btn-girar").addEventListener("click", () => {
  facingMode = facingMode === "environment" ? "user" : "environment";
  encenderCamara();
});

$("input-foto").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    apagarCamara();
    fotoSubida = reader.result;
    foto.src = fotoSubida;
    foto.hidden = false;
    video.hidden = true;
    $("camara-vacia").hidden = true;
  };
  reader.readAsDataURL(file);
  e.target.value = "";
});

// Dibuja una fuente (video o imagen) en el canvas, limitando el lado mayor.
function aJpeg(fuente, ancho, alto, ladoMax, calidad) {
  const escala = Math.min(1, ladoMax / Math.max(ancho, alto));
  const canvas = $("canvas");
  canvas.width = Math.round(ancho * escala);
  canvas.height = Math.round(alto * escala);
  canvas.getContext("2d").drawImage(fuente, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", calidad);
}

async function capturar() {
  if (stream && video.videoWidth) {
    return aJpeg(video, video.videoWidth, video.videoHeight, 1568, 0.85);
  }
  if (fotoSubida) {
    await foto.decode().catch(() => {});
    return aJpeg(foto, foto.naturalWidth, foto.naturalHeight, 1568, 0.85);
  }
  return null;
}

function miniatura(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(aJpeg(img, img.naturalWidth, img.naturalHeight, 240, 0.6));
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

// ---------- Claude ----------
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["lectura_ok", "mis_cartas", "board", "calle", "confianza_lectura",
    "accion", "sizing", "razonamiento", "regla_aplicada", "para_estudiar", "que_se_ve"],
  properties: {
    lectura_ok: { type: "boolean", description: "true si se pudieron leer mis cartas con claridad" },
    mis_cartas: { type: "string", description: "Ej: 'A♠ K♥'. Vacío si no se ven." },
    board: { type: "string", description: "Ej: 'Q♦ 7♣ 2♠'. Vacío si es preflop." },
    calle: { type: "string", enum: ["preflop", "flop", "turn", "river", "desconocida"] },
    confianza_lectura: { type: "string", enum: ["alta", "media", "baja"] },
    accion: { type: "string", enum: ["FOLD", "CHECK", "CALL", "BET", "RAISE", "ALL-IN", "SIN DATOS"] },
    sizing: { type: "string", description: "Ej: '33% pot', '2.5bb', '3x'. Vacío si no aplica." },
    razonamiento: { type: "string", description: "2-4 frases, claro y concreto." },
    regla_aplicada: { type: "string", description: "Cita o parafraseo de la regla de MI ESTRATEGIA usada, o 'No cubierto en tu estrategia: ...' si no hay regla." },
    para_estudiar: { type: "string", description: "Un concepto o pregunta para llevar a la próxima clase." },
    que_se_ve: { type: "string", description: "Breve descripción de lo leído en la imagen (stacks, pozo, acción, jugadores)." },
  },
};

function promptSistema(estrategia) {
  return `Sos un coach de poker que ayuda a un alumno a aplicar lo que aprende en sus clases (Jake Poker).
Recibís una foto o captura de su mesa (en vivo o pantalla) y respondés en español rioplatense.

Tu trabajo:
1. Leer con cuidado la imagen: cartas propias, board, pozo, stacks, apuestas y posición si se ven.
   Si una carta no se lee bien, decilo y bajá la confianza; nunca inventes cartas.
2. Recomendar UNA acción siguiendo, ante todo, la estrategia del alumno que está abajo.
   Si su estrategia no cubre el spot, usá teoría estándar sólida y aclaralo en "regla_aplicada"
   empezando con "No cubierto en tu estrategia:".
3. Explicar el porqué en pocas frases, conectándolo con sus reglas, para que aprenda.
Si no se pueden leer sus cartas, devolvé accion "SIN DATOS" y explicá qué foto necesitás.

=== ESTRATEGIA DEL ALUMNO ===
${estrategia}
=== FIN ESTRATEGIA ===`;
}

function contextoMano() {
  const partes = [
    ["Posición", $("ctx-posicion").value],
    ["Stack", $("ctx-stack").value && `${$("ctx-stack").value} BB`],
    ["Formato", $("ctx-formato").value],
    ["Acción / notas", $("ctx-accion").value.trim()],
  ].filter(([, v]) => v);
  return partes.length
    ? "Contexto que da el alumno:\n" + partes.map(([k, v]) => `- ${k}: ${v}`).join("\n")
    : "El alumno no dio contexto extra; deducí lo que puedas de la imagen.";
}

let enCurso = false;

async function analizar() {
  if (enCurso) return;
  const apiKey = leer(KEYS.apiKey, "");
  if (!apiKey) {
    setEstado($("estado"), "Falta tu API key: cargala en Ajustes.", true);
    return;
  }
  const dataUrl = await capturar();
  if (!dataUrl) {
    setEstado($("estado"), "Encendé la cámara o subí una foto primero.", true);
    return;
  }

  enCurso = true;
  $("btn-analizar").disabled = true;
  setEstado($("estado"), "Analizando la mano…");

  const modelo = leer(KEYS.modelo, "claude-opus-5");
  const estrategia = leer(KEYS.estrategia, PLANTILLA_ESTRATEGIA);
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const params = {
    model: modelo,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: {
      effort: leer(KEYS.effort, "low"),
      format: { type: "json_schema", schema: SCHEMA },
    },
    // La estrategia se repite en cada análisis: cachearla abarata y acelera los pedidos siguientes.
    system: [{ type: "text", text: promptSistema(estrategia), cache_control: { type: "ephemeral" } }],
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: dataUrl.split(",")[1] } },
        { type: "text", text: `${contextoMano()}\n\n¿Qué hago en esta mano?` },
      ],
    }],
  };
  // En Opus 5, si un clasificador rechaza el pedido, la API reintenta con el modelo recomendado.
  if (modelo === "claude-opus-5") {
    params.betas = ["server-side-fallback-2026-07-01"];
    params.fallbacks = "default";
  }

  const t0 = performance.now();
  try {
    const resp = await client.beta.messages.create(params);
    if (resp.stop_reason === "refusal") {
      throw new Error("Claude no pudo responder este pedido. Probá con otra foto.");
    }
    if (resp.stop_reason === "max_tokens") {
      throw new Error("La respuesta quedó cortada. Probá con profundidad 'Rápida'.");
    }
    const texto = resp.content.find((b) => b.type === "text")?.text;
    if (!texto) throw new Error("Respuesta vacía de Claude.");
    const r = JSON.parse(texto);
    mostrarResultado(r);
    setEstado($("estado"), `Listo en ${((performance.now() - t0) / 1000).toFixed(1)} s.`);
    await agregarHistorial(r, dataUrl);
  } catch (err) {
    setEstado($("estado"), mensajeError(err), true);
  } finally {
    enCurso = false;
    $("btn-analizar").disabled = false;
  }
}

function mensajeError(err) {
  if (err instanceof Anthropic.AuthenticationError) return "API key inválida. Revisala en Ajustes.";
  if (err instanceof Anthropic.RateLimitError) return "Límite de uso alcanzado; esperá unos segundos.";
  if (err instanceof Anthropic.APIConnectionError) return "Sin conexión con la API de Anthropic.";
  if (err instanceof Anthropic.APIError) return `Error de la API (${err.status}): ${err.message}`;
  return err.message || String(err);
}

function mostrarResultado(r) {
  $("resultado").hidden = false;
  $("r-accion").textContent = r.sizing ? `${r.accion} · ${r.sizing}` : r.accion;
  $("r-cartas").textContent = r.mis_cartas || "—";
  $("r-board").textContent = r.board || "—";
  $("r-calle").textContent = r.calle;
  $("r-confianza").textContent = r.confianza_lectura;
  $("r-razon").textContent = r.razonamiento;
  $("r-regla").textContent = r.regla_aplicada;
  $("r-estudio").textContent = r.para_estudiar;
  $("r-lectura").textContent = `Lo que vi: ${r.que_se_ve}`;
  $("resultado").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

$("btn-analizar").addEventListener("click", analizar);

// ---------- modo automático ----------
let timerAuto = null;
function actualizarAuto() {
  clearInterval(timerAuto);
  timerAuto = null;
  if ($("chk-auto").checked) {
    const seg = Math.max(5, Number($("auto-seg").value) || 15);
    timerAuto = setInterval(analizar, seg * 1000);
    analizar();
  }
}
$("chk-auto").addEventListener("change", actualizarAuto);
$("auto-seg").addEventListener("change", () => $("chk-auto").checked && actualizarAuto());

// ---------- historial ----------
async function agregarHistorial(r, dataUrl) {
  const entrada = {
    fecha: new Date().toISOString(),
    contexto: contextoMano(),
    resultado: r,
    miniatura: await miniatura(dataUrl),
  };
  let lista = [entrada, ...leerHistorial()].slice(0, MAX_HISTORIAL);
  // Si el almacenamiento se llena, descartar las entradas más viejas.
  while (lista.length && !guardar(KEYS.historial, JSON.stringify(lista))) {
    lista = lista.slice(0, -1);
  }
}

function renderHistorial() {
  const ol = $("lista-historial");
  ol.replaceChildren();
  const lista = leerHistorial();
  if (!lista.length) {
    ol.innerHTML = "<p class='nota'>Todavía no hay manos analizadas.</p>";
    return;
  }
  for (const h of lista) {
    const li = document.createElement("li");
    if (h.miniatura) {
      const img = document.createElement("img");
      img.src = h.miniatura;
      img.alt = "";
      li.append(img);
    }
    const r = h.resultado;
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = new Date(h.fecha).toLocaleString();
    const titulo = document.createElement("strong");
    titulo.textContent = `${r.mis_cartas || "?"} ${r.board ? "| " + r.board : ""} → ${r.accion}${r.sizing ? " " + r.sizing : ""}`;
    const razon = document.createElement("p");
    razon.textContent = r.razonamiento;
    const regla = document.createElement("p");
    regla.className = "nota";
    regla.textContent = r.regla_aplicada;
    li.append(meta, titulo, razon, regla);
    ol.append(li);
  }
}

$("btn-exportar-historial").addEventListener("click", () => {
  const lista = leerHistorial().map(({ miniatura, ...resto }) => resto);
  descargar(`historial-poker-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify(lista, null, 2), "application/json");
});
$("btn-borrar-historial").addEventListener("click", () => {
  if (confirm("¿Borrar todo el historial de manos?")) {
    guardar(KEYS.historial, "[]");
    renderHistorial();
  }
});

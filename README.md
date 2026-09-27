# Poker Coach 📷♠

Web app (funciona en el celular) que mira tu mesa de poker con la cámara y te sugiere
qué hacer **según tu propia estrategia** — lo que vas aprendiendo en tus clases de Jake Poker.

> ⚠️ **Modo estudio.** Usala para practicar, en partidas entre amigos que estén de acuerdo o
> para repasar manos. La asistencia en tiempo real (RTA) está prohibida en las salas online
> de dinero real y en los casinos, y puede costarte la cuenta y los fondos.

## Cómo funciona

1. **Mi estrategia**: escribís tus rangos, reglas, sizings y ajustes (hay una plantilla de ejemplo).
2. **Mesa**: encendés la cámara (o subís una captura) y tocás **¿Qué hago?**.
3. Claude lee cartas, board, pozo y stacks de la imagen, y devuelve:
   - la acción sugerida y el sizing,
   - por qué, citando **la regla de tu estrategia** que aplica
     (o te avisa si el spot no está cubierto),
   - un concepto para llevar a la próxima clase.
4. **Historial**: cada mano queda guardada en el dispositivo; la podés exportar a JSON
   para revisarla con tu coach.

## Cómo usarla

Necesitás una API key de Anthropic (<https://console.anthropic.com/>). Se guarda solo en tu
navegador y se envía directo a la API de Anthropic.

La cámara del navegador exige **https** (o `localhost`):

- **GitHub Pages**: en el repo, *Settings → Pages → Deploy from a branch*, elegí la rama y la
  carpeta raíz; la app queda en `https://<usuario>.github.io/<repo>/poker-coach/`.
- **Local**: `cd poker-coach && python3 -m http.server 8000` y abrí <http://localhost:8000>.

## Archivos

| Archivo | Qué hace |
|---|---|
| `poker-coach/index.html` | Interfaz (pestañas Mesa, Mi estrategia, Historial, Ajustes) |
| `poker-coach/app.js` | Cámara, llamada a Claude (visión + salida JSON estructurada), historial |
| `poker-coach/estrategia-plantilla.js` | Plantilla inicial de estrategia para editar |
| `poker-coach/style.css` | Estilos |

Modelos: Claude Opus 5 (por defecto, mejor análisis) o Claude Sonnet 5 (más rápido y barato),
seleccionables en Ajustes junto con la profundidad del análisis.

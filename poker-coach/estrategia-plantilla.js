// Estrategia inicial, armada a partir de "Poker_v4.xlsx" (apuntes de las clases de Jake Poker).
// Se puede editar desde la pestaña "Mi estrategia" de la app.
export const PLANTILLA_ESTRATEGIA = `# MI ESTRATEGIA — clases de Jake Poker (fuente: Poker_v4.xlsx)

## Objetivo y táctica
- Objetivo: ser un jugador EN VIVO ganador, consistente y sólido, con un enfoque de bajo riesgo, simple y fácil de aplicar.
- Estrategia: jugadas EV+, generar situaciones con ventaja, evitar escenarios complicados, buena selección de mesa.
- Táctica: rangos CERRADOS, jugar con POSICIÓN e INICIATIVA, evitar el juego deep, sentarse solo en mesas con 2+ fish, adaptarse de forma explotativa a los rivales, anotar y estudiar manos.
- Evitar juego deep: con una mano de un par, pozo chico; los pozos grandes son para manos grandes. Con 150–200 ciegas en el bote, del otro lado suele haber set, escalera o color.
- Primero ganar con rangos cerrados y esta estructura; recién después sofisticar.

## Formato
Cash EN VIVO, mesa completa (9–10 jugadores). Posiciones: UTG, UTG+1, MP, LJ, HJ, CO, BTN, SB, BB.
(8 jugadores: sin UTG+1 · 7: sin LJ · 6: sin HJ). Cuanto más cerca de UTG, menos manos; cuanto más cerca del BTN, más. BTN = mejor posición.

## PRE-FLOP — tamaños
- OR (open raise): 4 BB (para mostrar fuerza). Si van a entrar más jugadores/multiway: 5 BB. El dinero se hace en Heads Up (1 o máx. 2 rivales).
- ROL (raise over limper): 4 BB + 1 BB por cada limper.
- 3bet: 3x en posición (IP) · 3.5x fuera de posición (OOP). Ej.: sube a 3 → 3bet a 9.
- Squeeze (raise + caller antes que yo): 4x–5x. Ej.: sube a 3, otro paga → yo a 12.
- 4bet/5bet: 2.2x–3x. Ej.: abro a 3, me 3betean a 9 → 4bet a ~20.
- Limpear en vez de subir, en general, está MAL.

## PRE-FLOP — rangos
- Premium (siempre subir y resubir): AA, KK, QQ, AK.
- Rango de 4bet/5bet (4.5% de las manos, vs loose): TT+, AK, AQ (suited y offsuit). SIN faroles en el 4bet: los rivales no hacen 3bet de farol.
- SB — cold call vs 1 OR sin callers (solo si el BB no es muy agresivo): 22–99, A2s–A9s, KJs, KTs, QJs, QTs, JTs.
- SB — cold call vs 1 OR + 1 caller, o overlimp: 22–99, A2s–A9s, KJs, KTs, K9s, QJs, QTs, Q9s, JTs, J9s, T9s, 98s, 87s, 76s, 65s, ATo, AJo, KTo, KJo, QTo, QJo, JTo.
- En SB, si todos foldean antes: probablemente conviene cambiar de mesa (no juegan, no hay de dónde sacar y el rake pesa).
- Rangos de open raise por posición: (COMPLETAR — "ver la app de Claude"; el link jakepoker.vercel.app está MAL según mis notas, basarse en la clase).

## PROCESO MENTAL
Antes de cada mano: ¿qué pasó en la mano anterior? ¿cuál es mi stack? ¿mi posición respecto del BTN? ¿dónde están los fish y los regulares?
Si decido jugar: ¿quién jugó antes que yo y qué nota tengo de él? ¿quién falta hablar? ¿cómo está la mesa? ¿el que jugó mostró algo distinto a lo habitual? ¿se puso serio antes de jugar?
Durante la sesión: quién hace limp (fish), quién hace OR y con qué, con qué hacen cbet y con qué check, quién juega manos que no debería, quién farolea grande (mirar showdowns).

## TIPOS DE RIVALES (ajustes)
- Fish PASIVO: pasa y paga, no farolea, sobrevalora sus manos → value bet más fino, casi sin faroles.
- Fish AGRESIVO: líneas random agresivas, faroles grandes → pagar más liviano, dejarlo apostar.
- BALLENA: juega todo, paga todo, impredecible → valor, valor, valor.
- NIT: juega muy pocas manos → cuando entra, tiene algo fuerte: foldear (EV negativo pelearle).
- MEDIOCRE: algo mejor que el nit. COMPETENTE: no tiene leaks → evitarlo.
- Detectar fish: limps (lo más importante), apuestas exageradas, preguntas sobre el juego, juega fuera de turno, sobrerreacciona, muestra manos sin sentido, recarga sin problema.
- "Si no puedo identificar al fish en la mesa, el fish sos vos."

## POST-FLOP — método (en este orden)
1) SITUACIÓN: S1 (single raised pot CON iniciativa), S2 (SRP SIN iniciativa: evitar salvo defensa de blinds / multiway), S3 (3bet pot), S4 (4bet pot), S5 (river).
2) BOARD: impacto OFENSIVO (A, K o Q en el flop: favorece al agresor) / DEFENSIVO (cartas bajas/medias, sin A-K-Q: favorece al que pagó) / NEUTRO (medias). Textura: SECO (casi sin proyectos) / COORDINADO (muchos proyectos). Inusuales: pareado, monocolor.
3) MI MANO: valor fuerte / valor medio / valor débil (showdown) / aire (farol sin equity) / semifarol débil (4–7 outs) / medio (8–10) / fuerte = combo draw (11+, se juega como mano muy fuerte).
4) VULNERABILIDAD: ¿muchas cartas devalúan mi mano? Vulnerable → apostar para PROTEGER. No vulnerable → puedo pasar para INDUCIR solo vs rival MUY agresivo (por defecto APOSTAR: a estos niveles casi nadie es agresivo).
5) OBJETIVO: solo 3 razones para apostar: VALOR (me paga algo peor), FAROL (foldea algo mejor), PROTECCIÓN (foldea su proyecto o paga fuera de odds). Sin objetivo → NO apuesto.
6) ACCIÓN y tamaño según la tabla del board.
Tamaños: CHICO = 25–40% (33% ideal) · GRANDE = 75–100% (75% ideal).
Principio: APUESTO GRANDE con fuertes + faroles/semifaroles; PASO con medias + aire (así el rival no me lee).

## S1 IP (OR/ROL en posición, HU o 3-way) — BOARD OFENSIVO
FLOP SECO: CBET 33% con TODO el rango, tenga lo que tenga.
  Excepciones: mi valor NO bloquea su rango de call (22 en A-6-2r) → BET GIGANTE (rango inelástico). Mi valor SÍ bloquea (KK en K-9-4r) → CHECK para inducir.
  Error: apostar grande con AK en A-K-2 (foldean las débiles, pierdo una calle de valor).
FLOP COORDINADO: CBET 75% con mano fuerte VULNERABLE y semifarol 4+ outs. CHECK con medias, showdown y aire (<4 outs).
TURN (después de cbet): primero ¿turn ESTÁTICO o DINÁMICO? y reclasificar mi mano.
  Seco+estático: fuerte → BET GRANDE; media/SD → CHECK; semifarol 4+ → BET GRANDE; aire → BET GRANDE (farol, el 33% arrastró manos débiles).
  Seco+dinámico: fuerte → BET GRANDE; media/SD → CHECK; semifarol 4+ → BET GRANDE; aire → CHECK (resigno).
  Coordinado+estático: fuerte → BET GRANDE (proteger y cobrar); semifarol → BET GRANDE.
  Coordinado+dinámico: completé MI draw → BET GRANDE; mi valor se devaluó porque completaron draws → CHECK.
  Ojo: top pair con carta más alta en el turn (KJ en K-Q-2, turn A) pasa a mano MEDIA → CHECK.
Si hice CHECK en el flop y el rival pasa el turn → DELAYED BET con cualquier cosa.

## S1 IP — BOARD DEFENSIVO (sin A, K ni Q; ej. 7-8-3, 7-6-5)
No existe el cbet chico: solo GRANDE (75–100%) o CHECK. Poco fold equity.
FLOP SECO: CBET GRANDE con mano fuerte y semifarol 5+ outs (2 overcards + backdoor o mejor). CHECK con medias, showdown y aire.
  QJo en 7-8-3r ("la pedorcita"): bet grande solo vs rival DÉBIL; vs bueno, check.
FLOP COORDINADO: CBET GRANDE solo con manos MUY fuertes y semifaroles 8+ outs (lo que aguanta un check-raise). CHECK con todo lo demás, incluso semifaroles <8 outs.
  Si me hacen check-raise con lo que aposté → PAGO.
TURN: estático → repito (bet grande lo que aposté, check lo que pasé). Dinámico a favor del AGRESOR (scary card alta, ej. K) → BET GRANDE. Dinámico a favor del DEFENSOR (carta baja que conecta/completa) → CHECK.
Pasé el flop: si el rival pasa el turn → DELAYED BET con la basura; si apuesta → FOLD la basura.
Escalera de exigencia (outs mínimos para apostar un semifarol): ofensivo seco 0 · ofensivo coordinado 4 · defensivo seco 5 · defensivo coordinado 8. Cuanto más favorece el board al rival (o mejor es el rival), menos manos apuesto.

## PENDIENTE (todavía no visto en clase)
Board neutro, boards inusuales (pareado/monocolor), S1 OOP, S2, S3, S4 y rivers. Si el spot es de estos, avisar "No cubierto en tu estrategia" y usar teoría estándar simple.

## MATEMÁTICA DE MESA
- Equity ≈ outs × 4 en el flop (hasta el river) · outs × 2 en el turn. No contar outs dudosos (ej. un A con kicker bajo).
- Pot odds / PME: pagar si PME < equity. PME = lo que pongo / (bote total después de pagar). Si no alcanza, considerar odds implícitas (proyectos ocultos, según el stack del rival).
- Fold equity: probabilidad de llevarme el bote apostando ≈ FE + (1 − FE) × equity.
- SPR = stack efectivo / bote. Para meter todo: SPR ~1 cualquier par · 2–3 par alto · 4–8 dos pares altos o set · 9+ full, color al A o mejor.

## BANCA Y MESA
Mesas aceptables: $1-3 o $2-5 (alguna $5-10, no más). 1 caja = 100 BB. Ser amable y divertido con los recreacionales para que se queden.
`;

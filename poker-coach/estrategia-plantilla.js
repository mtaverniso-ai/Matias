// Plantilla inicial. Reemplazala con lo que definas en tus clases de Jake Poker.
export const PLANTILLA_ESTRATEGIA = `# MI ESTRATEGIA (clases de Jake Poker)
# Editá todo esto con lo que vas aprendiendo. Claude basa sus sugerencias en este texto.

## Formato principal
Cash 6-max, 100bb efectivos.

## Preflop – rangos de apertura (RFI)
UTG: 77+, ATs+, KTs+, QTs+, JTs, T9s, AJo+, KQo
HJ:  55+, A9s+, A5s-A4s, K9s+, Q9s+, J9s+, T9s, 98s, ATo+, KJo+
CO:  22+, A2s+, K8s+, Q9s+, J9s+, T8s+, 98s, 87s, 76s, A9o+, KTo+, QJo
BTN: 22+, A2s+, K5s+, Q7s+, J7s+, T7s+, 96s+, 85s+, 75s+, 64s+, 54s, A5o+, K9o+, Q9o+, J9o+, T9o
SB:  (completar)
Sizing de apertura: 2.5bb (BTN 2.2bb, SB 3bb)

## Preflop – vs apertura
3-bet value: QQ+, AK
3-bet bluff: A5s-A4s, (completar)
Call en BTN/BB: (completar)
Sizing 3-bet: 3x en posición, 4x fuera de posición

## Postflop – reglas
- C-bet chico (25-33%) en boards secos con ventaja de rango (ej. A-K-x rainbow).
- Check más seguido en boards conectados/bajos que favorecen al que pagó.
- Barrel en turn con equity (proyectos) + blockers, o valor.
- River: bluffear con manos que bloquean el value del rival y desbloquean sus folds.

## Ajustes vs rivales
- Recreacional pasivo: más value bet fino, menos bluffs.
- Reg agresivo: (completar)

## Errores que estoy corrigiendo
- (completar)
`;

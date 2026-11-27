/** Separa el horario en renglones. El dueño los separa con "·" en el panel. */
export function lineasHorario(horario: string) {
  return horario
    .split(/\s*[·|]\s*/)
    .map((l) => l.trim())
    .filter(Boolean);
}

/**
 * En texto vertical japonés la raya de vocal larga (ー) y la tilde (〜) se escriben
 * verticales; como apilamos los caracteres, hay que girarlas 90°.
 */
export const GIRAR_EN_VERTICAL = /[ー〜～—－]/;

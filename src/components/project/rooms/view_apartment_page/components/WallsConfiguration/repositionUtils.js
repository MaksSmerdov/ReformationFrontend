export const scaleFactor = 0.045;

export function calcGaps (shapes) {
  const a = shapes.find((s) => s.id === 'seinaA');
  const b = shapes.find((s) => s.id === 'seinaB');
  const c = shapes.find((s) => s.id === 'seinaC');
  const k = shapes.find((s) => s.id === 'kattoK');
  if (!(a && b && c && k)) return null;

  const gapX = b.x - (a.x + a.width * scaleFactor);
  const gapY = c.y - (k.y + k.height * scaleFactor);
  return { gapX, gapY };
}

export function repositionShapes (current, gaps) {
  if (!gaps) return current;

  const { gapX, gapY } = gaps;
  const next = current.map((s) => ({ ...s }));
  const byId = Object.fromEntries(next.map((s) => [s.id, s]));

  const a = byId.seinaA;
  const b = byId.seinaB;
  const c = byId.seinaC;
  const d = byId.seinaD;
  const k = byId.kattoK;
  const l = byId.lattiaL;

  if (!(a && b && c && d && k && l)) return current;

  const wA = a.width * scaleFactor;
  const wB = b.width * scaleFactor;
  const wC = c.width * scaleFactor;
  const wD = d.width * scaleFactor;
  const wK = k.width * scaleFactor;
  const wL = l.width * scaleFactor;

  const hK = k.height * scaleFactor;
  const hC = c.height * scaleFactor;

  // горизонталь
  b.x = a.x + wA + gapX;
  c.x = b.x + wB + gapX;
  d.x = c.x + wC + gapX;

  // katto / lattia по центру C
  k.x = c.x + (wC - wK) / 2;
  l.x = c.x + (wC - wL) / 2;

  // вертикаль
  k.y = c.y - gapY - hK;
  l.y = c.y + hC + gapY;

  return next;
}

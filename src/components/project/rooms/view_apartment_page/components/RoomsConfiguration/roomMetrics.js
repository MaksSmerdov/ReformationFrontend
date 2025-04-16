const mm2ToM2 = (v) => v / 1_000_000;

export const getRoomMetrics = (walls) => {
  const wallL = walls.find(w => w.id.endsWith('-L'));
  const floorWidth = wallL?.width ?? 0;
  const floorDepth = wallL?.height ?? 0;

  const maxHeight = Math.max(
    ...['-A', '-B', '-C', '-D'].map(sfx => walls.find(w => w.id.endsWith(sfx))?.height ?? 0),
  );

  return {
    width: floorWidth,
    depth: floorDepth,
    height: maxHeight,
    areaM2: mm2ToM2(floorWidth * floorDepth),
  };
};

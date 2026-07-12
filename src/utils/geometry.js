// utils/geometry.js — 2D transform math

export function translate(points, dx, dy) {
  return mapPoints(points, ([x, y]) => [x + dx, y + dy]);
}

export function rotate(points, angleDeg, center = [0, 0]) {
  const rad = (angleDeg * Math.PI) / 180;
  const [cx, cy] = center;
  return mapPoints(points, ([x, y]) => {
    const dx = x - cx, dy = y - cy;
    return [
      cx + dx * Math.cos(rad) - dy * Math.sin(rad),
      cy + dx * Math.sin(rad) + dy * Math.cos(rad),
    ];
  });
}

export function reflect(points, axis = 'y') {
  return mapPoints(points, ([x, y]) => {
    if (axis === 'x') return [x, -y];
    if (axis === 'y') return [-x, y];
    if (axis === 'y=x') return [y, x];
    if (axis === 'y=-x') return [-y, -x];
    return [x, y];
  });
}

export function dilate(points, scaleFactor, center = [0, 0]) {
  const [cx, cy] = center;
  return mapPoints(points, ([x, y]) => [
    cx + (x - cx) * scaleFactor,
    cy + (y - cy) * scaleFactor,
  ]);
}

function mapPoints(points, fn) {
  return Object.fromEntries(Object.entries(points).map(([k, v]) => [k, fn(v)]));
}

export function isMatch(pointsA, pointsB, tolerance = 0.4) {
  return Object.keys(pointsA).every((key) => {
    if (!pointsB[key]) return false;
    const [ax, ay] = pointsA[key];
    const [bx, by] = pointsB[key];
    return Math.hypot(ax - bx, ay - by) <= tolerance;
  });
}

export function centroid(points) {
  const vals = Object.values(points);
  const x = vals.reduce((s, [px]) => s + px, 0) / vals.length;
  const y = vals.reduce((s, [, py]) => s + py, 0) / vals.length;
  return [x, y];
}

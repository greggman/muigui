import { assert } from '../libs/assert.js';

function getEllipsePointForAngle(cx, cy, rx, ry, phi, theta) {
  const m = Math.abs(rx) * Math.cos(theta);
  const n = Math.abs(ry) * Math.sin(theta);

  return [
    cx + Math.cos(phi) * m - Math.sin(phi) * n,
    cy + Math.sin(phi) * m + Math.cos(phi) * n,
  ];
}

function getEndpointParameters(cx, cy, rx, ry, phi, theta, dTheta) {
  const [x1, y1] = getEllipsePointForAngle(cx, cy, rx, ry, phi, theta);
  const [x2, y2] = getEllipsePointForAngle(cx, cy, rx, ry, phi, theta + dTheta);

  const fa = Math.abs(dTheta) > Math.PI ? 1 : 0;
  const fs = dTheta > 0 ? 1 : 0;

  return { x1, y1, x2, y2, fa, fs };
}

export function arc(cx, cy, r, start, end) {
  assert(Math.abs(start - end) <= Math.PI * 2);
  assert(start >= -Math.PI && start <= Math.PI * 2);
  assert(start <= end);
  assert(end >= -Math.PI && end <= Math.PI * 4);

  const { x1, y1, x2, y2, fa, fs } = getEndpointParameters(cx, cy, r, r, 0, start, end - start);
  return Math.abs(Math.abs(start - end) - Math.PI * 2) > Number.EPSILON
     ? `M${cx} ${cy} L${x1} ${y1} A ${r} ${r} 0 ${fa} ${fs} ${x2} ${y2} L${cx} ${cy}`
     : `M${x1} ${y1} L${x1} ${y1} A ${r} ${r} 0 ${fa} ${fs} ${x2} ${y2}`;
}

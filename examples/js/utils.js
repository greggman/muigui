export function getCSSRulesBySelector(selector, styleSheet) {
  const rules = [];
  const styleSheets = styleSheet ? [styleSheet] : document.styleSheets;
  for (let s = 0; s < styleSheets.length; ++s) {
    const cssRules = styleSheets[s].cssRules;
    for (let i = 0; i < cssRules.length; ++i) {
      const r = cssRules[i];
      if (r.selectorText === selector) {
        rules.push(r);
      }
    }
  }
  return rules;
}

export function resizeCanvasToDisplaySize(canvas, mult = 1) {
  const width = canvas.clientWidth * mult;
  const height = canvas.clientHeight * mult;
  const needResize = canvas.width !== width || canvas.height !== canvas.height;
  if (needResize) {
    canvas.width = width;
    canvas.height = height;
  }
  return needResize;
}

export const hsl = (h, s, l) => `hsl(${h * 360},${s * 100}%,${l * 100}%)`;

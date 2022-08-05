export function onResize(elem, callback) {
  new ResizeObserver(() => {
    callback({rect: elem.getBoundingClientRect(), elem});
  }).observe(elem);
}

export function onResizeSVGNoScale(elem, hAnchor, vAnchor, callback) {
  onResize(elem, ({rect}) => {
    const {width, height} = rect;
    elem.setAttribute('viewBox', `-${width * hAnchor} -${height * vAnchor} ${width} ${height}`);
    callback({elem, rect});
  });
}

export function onResizeCanvas(elem, callback) {
  onResize(elem, ({rect}) => {
    const {width, height} = rect;
    elem.width = width;
    elem.height = height;
    callback({elem, rect});
  });
}

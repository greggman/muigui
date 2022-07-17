export function onResize(elem, callback) {
  new ResizeObserver(() => {
    callback({rect: elem.getBoundingClientRect(), elem});
  }).observe(elem);
}

export function onResizeSVGNoScale(elem, callback) {
  onResize(elem, ({rect}) => {
    const {width, height} = rect;
    elem.setAttribute('viewBox', `-${width / 2} -${height / 2} ${width} ${height}`);
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

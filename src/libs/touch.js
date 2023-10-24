function noop() {
}

export function computeRelativePosition(elem, event, start) {
  const rect = elem.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const nx = x / rect.width;
  const ny = y / rect.height;
  start = start || [x, y];
  const dx = x - start[0];
  const dy = y - start[1];
  const ndx = dx / rect.width;
  const ndy = dy / rect.width;
  return {x, y, nx, ny, dx, dy, ndx, ndy};
}

export function addTouchEvents(elem, {onDown = noop, onMove = noop, onUp = noop}) {
  let start;
  const pointerMove = function(event) {
    const e = {
      type: 'move',
      ...computeRelativePosition(elem, event, start),
    };
    onMove(e);
  };

  const pointerUp = function(event) {
    elem.releasePointerCapture(event.pointerId);
    elem.removeEventListener('pointermove', pointerMove);
    elem.removeEventListener('pointerup', pointerUp);

    document.body.style.backgroundColor = '';

    onUp('up');
  };

  const pointerDown = function(event) {
    elem.addEventListener('pointermove', pointerMove);
    elem.addEventListener('pointerup', pointerUp);
    elem.setPointerCapture(event.pointerId);

    const rel = computeRelativePosition(elem, event);
    start = [rel.x, rel.y];
    onDown({
      type: 'down',
      ...rel,
    });
  };

  elem.addEventListener('pointerdown', pointerDown);

  return function() {
    elem.removeEventListener('pointerdown', pointerDown);
  };
}
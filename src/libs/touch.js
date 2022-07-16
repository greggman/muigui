function noop() {
}

export function computeRelativePosition(elem, event) {
  const rect = elem.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const nx = x / rect.width;
  const ny = y / rect.height;
  return {x, y, nx, ny};
}

export function addTouchEvents(elem, {onDown = noop, onMove = noop, onUp = noop}) {
  const mouseMove = function(event) {
    onMove({
      type: 'move',
      ...computeRelativePosition(elem, event),
    });
  };

  const mouseUp = function() {
    window.removeEventListener('mousemove', mouseMove);
    window.removeEventListener('mouseup', mouseUp);
    onUp('up');
  };

  const mouseDown = function(event) {
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);
    onDown({
      type: 'down',
      ...computeRelativePosition(elem, event),
    });
  };

  elem.addEventListener('mousedown', mouseDown);

  return function() {
    elem.removeEventListener('mousedown', mouseDown);
  };
}
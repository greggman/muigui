function noop() {
}

const keyDirections = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

// This probably needs to be global
export function addKeyboardEvents(elem, {onDown = noop, onUp = noop}) {
  const keyDown = function (event) {
    const mult = event.shiftKey ? 10 : 1;
    const [dx, dy] = (keyDirections[event.key] || [0, 0]).map(v => v * mult);
    const fn = event.type === 'keydown' ? onDown : onUp;
    fn({
      type: event.type.substring(3),
      dx,
      dy,
      event,
    });
  };

  elem.addEventListener('keydown', keyDown);
  elem.addEventListener('keyup', keyDown);

  return function () {
    elem.removeEventListener('keydown', keyDown);
    elem.removeEventListener('keyup', keyDown);
  };
}
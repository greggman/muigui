const darkColors = {
  main: '#ddd',
};
const lightColors = {
  main: '#333',
};

const darkMatcher = window.matchMedia('(prefers-color-scheme: dark)');

let colors;
let isDarkMode;

function update() {
  isDarkMode = darkMatcher.matches;
  colors = isDarkMode ? darkColors : lightColors;
}
darkMatcher.addEventListener('change', update);
update();

export function graph(canvas, data, {
    min = -1,
    max = 1,
    interval = 16,
    color,
  }) {
  const ctx = canvas.getContext('2d');

  function render() {
    const {width, height} = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    const range = max - min;
    for (let i = 0; i < data.length; ++i) {
      const x = i * width / data.length;
      const y = (data[i] - min) * height / range;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color || colors.main;
    ctx.stroke();
  }
  setInterval(render, interval);
}
const css = `
.muigui {
  --width: 250px;
  --label-width: 45%;

  --bg-color: #222222;
  --color: #dddddd;
  --value-color: #43e5f7;
  --value-bg-color: #444444;
  --disabled-color: #666666;
  --menu-bg-color: #000000;
  --menu-sep-color: #444444;
  --hover-bg-color: #666666;
  --focus-color: #8AF;

  --button-bg-color: var(--value-bg-color);

  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-size: 11px;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --font-size-mono: 11px;

  --slider-width: 30px;

  --slider-left-color: var(--value-color);
  --slider-right-color: var(--value-bg-color);
  --slider-right-hover-color: var(--hover-bg-color);
  --line-height: 1.7em;
  --border-radius: 0px;

  width: var(--width);
  color: var(--color);
  background-color: var(--bg-color);
  font-family: var(--font-family);
  font-size: var(--font-size);
  box-sizing: border-box;
}
.muigui * {
  box-sizing: inherit;
}

.muigui-rows {
  display: flex;
  flex-direction: column;

  min-height: 20px;
  border: 2px solid red;
}
.muigui-columns {
  display: flex;
  flex-direction: row;

  height: 20px;
  border: 2px solid green;
}
.muigui-rows>*,
.muigui-columns>* {
  flex: 1 1 auto;
  align-items: stretch;
  min-height: 0;
  min-width: 0;
}

.muigui-row {
  border: 2px solid yellow;
  min-height: 10px
}
.muigui-column {
  border: 2px solid lightgreen;
}

/* -------- */

.muigui-show { /* */ }
.muigui-hide { 
  display: none !important;
}
.muigui-disabled {
  pointer-events: none;
  --color: var(--disabled-color) !important;
  --value-color: var(--disabled-color) !important;
  --slider-left-color: var(--disabled-color) !important;
}

.muigui canvas {
  display: block;
  background-color: var(--value-bg-color);
  border-radius: var(--border-radius);
}

.muigui-controller {
  word-wrap: initial;
  display: flex;
  align-items: stretch;
  min-width: 0;
  min-height: var(--line-height);
  margin: 0.4em 0 0.4em 0;
}
.muigui-root,
.muigui-menu {
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: none;
  height: fit-content;
  margin: 0;
  padding-bottom: 0.1em;
  border-radius: var(--border-radius);
}
.muigui-menu {
  border-bottom: 1px solid var(--menu-sep-color);
}


.muigui-root>button:nth-child(1),
.muigui-menu>button:nth-child(1) {
  border-top: 1px solid var(--menu-sep-color);
  border-bottom: 1px solid var(--menu-sep-color);
  position: relative;
  text-align: left;
  color: var(--color);
  background-color: var(--menu-bg-color);
  min-height: var(--line-height);
  padding-top: 0.2em;
  padding-bottom: 0.2em;
  cursor: pointer;
  border-radius: var(--border-radius);
}
.muigui-root>div:nth-child(2),
.muigui-menu>div:nth-child(2) {
  flex: 1 1 auto;
}

.muigui-controller {
  margin-left: 0.2em;
  margin-right: 0.2em;
}
.muigui-root.muigui-controller,
.muigui-menu.muigui-controller {
  margin-left: 0;
  margin-right: 0;
}
.muigui-controller>*:nth-child(1) {
  flex: 1 0 var(--label-width);
  min-width: 0;
  white-space: pre;
}
.muigui-controller>label:nth-child(1) {
  place-content: center start;
  display: inline-grid;
}
.muigui-controller>*:nth-child(2) {
  flex: 1 1 75%;
  min-width: 0;
}
.muigui-value {
  display: flex;
  align-items: stretch;
}
.muigui-value>* {
  flex: 1 1 auto;
  min-width: 0;
}
.muigui-value>*:nth-child(1) {
  flex: 1 1 60%;
}
.muigui-value>*:nth-child(2) {
  flex: 1 1 40%;
  margin-left: 0.2em;
}

/* fix! */
.muigui-open>button>label::before,
.muigui-closed>button>label::before {
  width: 1.5em;
  height: var(--line-height);
  display: inline-grid;
  place-content: center;
  pointer-events: none;
}
.muigui-open>button>label::before {
  content: "▼";
}
.muigui-closed>button>label::before {
  content: "▶";
}
.muigui-open>*:nth-child(2) {
  transition: max-height 0.2s ease-out,
              opacity 0.5s ease-out;
  max-height: 100vh;
  overflow: auto;
  opacity: 1;
}

.muigui-closed>*:nth-child(2) {
  transition: max-height 0.2s ease-out,
              opacity 1s;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

.muigui select,
.muigui option,
.muigui input,
.muigui button {
  color: var(--value-color);
  background-color: var(--value-bg-color);
  font-family: var(--font-family);
  font-size: var(--font-size);
  border: none;
  margin: 0;
  border-radius: var(--border-radius);
}
.muigui select {
  appearance: none;
  margin: 0;
  margin-left: 0; /*?*/
  overflow: hidden; /* Safari */
}

.muigui select:focus,
.muigui input:focus,
.muigui button:focus {
  outline: 1px solid var(--focus-color);
}

.muigui select:hover,
.muigui option:hover,
.muigui input:hover,
.muigui button:hover {
  background-color: var(--hover-bg-color);  
}

/* ------ [ label ] ------ */

.muigui-label {
  border-top: 1px solid var(--menu-sep-color);
  border-bottom: 1px solid var(--menu-sep-color);
  padding-top: 0.4em;
  padding-bottom: 0.3em;
  place-content: center start;
  background-color: var(--menu-bg-color);
  white-space: pre;
  border-radius: var(--border-radius);
}

/* ------ [ divider] ------ */

.muigui-divider {
    min-height: 6px;
    border-top: 2px solid var(--menu-sep-color);
    margin-top: 6px;
}

/* ------ [ button ] ------ */

.muigui-button button {
  border: none;
  color: var(--value-color);
  background-color: var(--button-bg-color);
  cursor: pointer;
  place-content: center center;
}

/* ------ [ color ] ------ */

.muigui-color>div {
  overflow: hidden;
  position: relative;
  margin-left: 0;
  margin-right: 0; /* why? */
  max-width: var(--line-height);
  border-radius: var(--border-radius);
}

.muigui-color>div:focus-within {
  outline: 1px solid var(--focus-color);
}

.muigui-color input[type=color] {
  border: none;
  padding: 0;
  background: inherit;
  cursor: pointer;
  position: absolute;
  width: 200%;
  left: -10px;
  top: -10px;
  height: 200%;
}
.muigui-disabled canvas,
.muigui-disabled .muigui-color input[type=color] {
  opacity: 0.3;
}

/* ------ [ checkbox ] ------ */

.muigui-checkbox>label:nth-child(2) {
  display: grid;
  place-content: center start;
  margin: 0;
}

.muigui-checkbox input[type=checkbox] {
  -webkit-appearance: none;
  appearance: none;
  width: auto;
  color: var(--value-color);
  background-color: var(--value-bg-color);
  cursor: pointer;

  display: grid;
  place-content: center;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 1.7em;
  height: 1.7em;
  transform: translateY(-0.075em);
}

.muigui-checkbox input[type=checkbox]::before {
  content: "";
  color: var(--value-color);
  display: grid;
  place-content: center;
}

.muigui-checkbox input[type=checkbox]:checked::before {
  content: "✔";
}

.muigui input[type=number]::-webkit-inner-spin-button, 
.muigui input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none;
  appearance: none;
  margin: 0; 
}
.muigui input[type=number] {
  -moz-appearance: textfield;
}

/* ------ [ slider ] ------ */

/* fix below */
.muigui-slider input[type=range] {
  cursor: ew-resize;
  overflow: hidden;
}

.muigui-slider input[type=range] {
  -webkit-appearance: none;
  appearance: none;
  background-color: var(--slider-right-color);
  margin: 0;
}
.muigui-slider input[type=range]:hover {
  background-color: var(--slider-right-hover-color);
}

.muigui-slider input[type=range]::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  appearance: none;
  height: max-content;
  color: var(--slider-left-color);
  margin-top: -1px;
}
.muigui-slider input[type=range]::-webkit-slider-runnable-track {
  color: red;
}

.muigui-slider input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0px;
  height: max-content;
  box-shadow: -1000px 0 0 1000px var(--slider-left-color);
}

/* FF */
.muigui-slider input[type=range]::-moz-range-progress {
  background-color: var(--slider-left-color); 
}
.muigui-slider input[type=range]::-moz-range-thumb {
  height: max-content;
  width: 0;
  border: none;
  box-shadow: -1000px 0 0 1000px var(--slider-left-color);
  box-sizing: border-box;
}

/* needs to be at bottom to take precedence */
.muigui-auto-place {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 100001;
}
`;
export default css;


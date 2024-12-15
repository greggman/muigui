export default {
  default: `
.muigui {
  --bg-color: #ddd;
  --color: #222;
  --contrast-color: #eee;
  --value-color: #145 ;
  --value-bg-color: #eeee;
  --disabled-color: #999;
  --menu-bg-color: #f8f8f8;
  --menu-sep-color: #bbb;
  --hover-bg-color: #999;
  --focus-color: #8BF;
  --range-color: #AAA;
  --invalid-color: #FF0000;
  --selected-color: rgb(255, 255, 255, 0.9);

  --button-bg-color: var(--value-bg-color);

  --image-open: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHN0eWxlPSJmaWxsOiAjNDQ0OyIgeD0iMjAlIiB5PSI0NSUiIHdpZHRoPSI2MCUiIGhlaWdodD0iMTAlIj48L3JlY3Q+Cjwvc3ZnPg==);
  --image-closed: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHN0eWxlPSJmaWxsOiAjNDQ0OyIgeD0iNDUlIiB5PSIyMCUiIHdpZHRoPSIxMCUiIGhlaWdodD0iNjAlIj48L3JlY3Q+CiAgPHJlY3Qgc3R5bGU9ImZpbGw6ICM0NDQ7IiB4PSIyMCUiIHk9IjQ1JSIgd2lkdGg9IjYwJSIgaGVpZ2h0PSIxMCUiPjwvcmVjdD4KPC9zdmc+);
  --image-checkerboard: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHN0eWxlPSJmaWxsOiAjNDA0MDQwOyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PC9yZWN0PgogIDxyZWN0IHN0eWxlPSJmaWxsOiAjODA4MDgwOyIgeD0iMCIgeT0iMCIgd2lkdGg9IjUwJSIgaGVpZ2h0PSI1MCUiPjwvcmVjdD4KICA8cmVjdCBzdHlsZT0iZmlsbDogIzgwODA4MDsiIHg9IjUwJSIgeT0iNTAlIiB3aWR0aD0iNTAlIiBoZWlnaHQ9IjUwJSI+PC9yZWN0Pgo8L3N2Zz4=);

  --range-left-color: var(--value-color);
  --range-right-color: var(--value-bg-color); 
  --range-right-hover-color: var(--hover-bg-color);
  --button-image: 
    linear-gradient(
      rgba(255, 255, 255, 1), rgba(0, 0, 0, 0.2)
    );

  color: var(--color);
  background-color: var(--bg-color);
}

@media (prefers-color-scheme: dark) {
  .muigui {
    --bg-color: #222222;
    --color: #dddddd;
    --contrast-color: #000;
    --value-color: #43e5f7;
    --value-bg-color: #444444;
    --disabled-color: #666666;
    --menu-bg-color: #080808;
    --menu-sep-color: #444444;
    --hover-bg-color: #666666;
    --focus-color: #458; /*#88AAFF*/;
    --range-color: #888888;
    --invalid-color: #FF6666;
    --selected-color: rgba(255, 255, 255, 0.3);

    --button-bg-color: var(--value-bg-color);

    --range-left-color: var(--value-color);
    --range-right-color: var(--value-bg-color); 
    --range-right-hover-color: var(--hover-bg-color);
    --button-image: linear-gradient(
        rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)
      );

    color: var(--color);
    background-color: var(--bg-color);

    --image-closed: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHN0eWxlPSJmaWxsOiAjREREOyIgeD0iMjAlIiB5PSI0NSUiIHdpZHRoPSI2MCUiIGhlaWdodD0iMTAlIj48L3JlY3Q+Cjwvc3ZnPg==);
    --image-open: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHN0eWxlPSJmaWxsOiAjREREOyIgeD0iNDUlIiB5PSIyMCUiIHdpZHRoPSIxMCUiIGhlaWdodD0iNjAlIj48L3JlY3Q+CiAgPHJlY3Qgc3R5bGU9ImZpbGw6ICNEREQ7IiB4PSIyMCUiIHk9IjQ1JSIgd2lkdGg9IjYwJSIgaGVpZ2h0PSIxMCUiPjwvcmVjdD4KPC9zdmc+);
  }
}

.muigui {
  --width: 250px;
  --label-width: 45%;
  --number-width: 40%;

  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-size: 11px;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --font-size-mono: 11px;

  --line-height: 1.7em;
  --border-radius: 0px;

  width: var(--width);
  font-family: var(--font-family);
  font-size: var(--font-size);
  box-sizing: border-box;
  line-height: 100%;
}
.muigui * {
  box-sizing: inherit;
}

.muigui-no-scroll {
  touch-action: none;
}
.muigui-no-h-scroll {
  touch-action: pan-y;
}
.muigui-no-v-scroll {
  touch-action: pan-x;
}

.muigui-invalid-value {
  background-color: red !important;
  color: white !important;
}

.muigui-grid {
  display: grid;
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
  --range-left-color: var(--disabled-color) !important;
}

.muigui canvas,
.muigui svg {
  display: block;
  border-radius: var(--border-radius);
}
.muigui canvas {
  background-color: var(--value-bg-color);
}

.muigui-controller {
  min-width: 0;
  min-height: var(--line-height);
}
.muigui-root {
  z-index: 1;
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
  padding: 0.2em;
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
  /* white-space: pre; why?? */
}
.muigui-controller>label:nth-child(1) {
  place-content: center start;
  display: inline-grid;
  overflow: hidden;
}
.muigui-controller>*:nth-child(2) {
  flex: 1 1 75%;
  min-width: 0;
}

/* -----------------------------------------
  a label controller is  [[label][value]]
*/

.muigui-label-controller {
  display: flex;
  margin: 0.4em 0 0.4em 0;
  word-wrap: initial;
  align-items: stretch;
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
  flex: 1 1 calc(100% - var(--number-width));
}
.muigui-value>*:nth-child(2) {
  flex: 1 1 var(--number-width);
  margin-left: 0.2em;
}

/* fix! */
.muigui-open>button>label::before,
.muigui-closed>button>label::before {
  content: "X";
  color: rgba(0, 0, 0, 0);
  background-color: var(--range-color);
  border-radius: 0.2em;
  width: 1.25em;
  margin-right: 0.25em;
  height: 1.25em; /*var(--line-height);*/
  display: inline-grid;
  place-content: center start;
  pointer-events: none;
}
.muigui-open>button>label::before {
  background-image: var(--image-open);
}
.muigui-closed>button>label::before {
  background-image: var(--image-closed);
}

.muigui-open>.muigui-open-container {
  transition: all 0.1s ease-out;
  overflow: auto;
  height: 100%;
}
.muigui-closed>.muigui-open-container {
  transition: all 0.1s ease-out;
  overflow: hidden;
  min-height: 0;
}
.muigui-open>.muigui-open-container>* {
  transition: all 0.1s ease-out;
  margin-top: 0px;
}
.muigui-closed>.muigui-open-container>* {
  transition: all 0.1s ease-out;
  margin-top: -1000%;
}

/* ---- popdown ---- */

.muigui-pop-down-top {
  display: flex;
}
/* fix? */
.muigui-value>*:nth-child(1).muigui-pop-down-top {
  flex: 0;
}
.muigui-closed .muigui-pop-down-bottom {
  max-height: 0;
}

.muigui-value .muigui-pop-down-bottom {
  margin: 0;
}

.muigui-pop-down-values {
  min-width: 0;
  display: flex;
}
.muigui-pop-down-values>* {
  flex: 1 1 auto;
  min-width: 0;
}

.muigui-value.muigui-pop-down-controller {
  flex-direction: column;
}

.muigui-pop-down-top input[type=checkbox] {
  -webkit-appearance: none;
  appearance: none;
  width: auto;
  color: var(--value-color);
  background-color: var(--value-bg-color);
  background-image: var(--image-checkerboard);
  background-size: 10px 10px;
  background-position: 0 0, 0 5px, 5px -5px, -5px 0px;

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

.muigui-pop-down-top input[type=checkbox]::before {
  content: "+";
  display: grid;
  place-content: center;
  border-radius: calc(var(--border-radius) + 2px);
  border-left: 1px solid rgba(255,255,255,0.3);
  border-top: 1px solid rgba(255,255,255,0.3);
  border-bottom: 1px solid rgba(0,0,0,0.2);
  border-right: 1px solid rgba(0,0,0,0.2);
  background-color: var(--range-color);
  color: var(--value-bg-color);
  width: calc(var(--line-height) - 4px);
  height: calc(var(--line-height) - 4px);
}

.muigui-pop-down-top input[type=checkbox]:checked::before {
  content: "Ｘ";
}


/* ---- select ---- */

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

.muigui-button {
  display: grid;
  padding: 2px 0 2px 0;
}
.muigui-button button {
  border: none;
  color: var(--value-color);
  background-color: var(--button-bg-color);
  background-image: var(--button-image);
  cursor: pointer;
  place-content: center center;
  height: var(--line-height);
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
.muigui-disabled svg,
.muigui-disabled img,
.muigui-disabled .muigui-color input[type=color] {
  opacity: 0.2;
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

/* ------ [ radio grid ] ------ */

.muigui-radio-grid>div {
  display: grid;
  gap: 2px;
}

.muigui-radio-grid input {
  appearance: none;
  display: none;
}

.muigui-radio-grid button {
  color: var(--color);
  width: 100%;
  text-align: left;
}

.muigui-radio-grid input:checked + button {
  color: var(--value-color);
  background-color: var(--selected-color);
}

/* ------ [ color-chooser ] ------ */

.muigui-color-chooser-cursor {
  stroke-width: 1px;
  stroke: white;
  fill: none;
}
.muigui-color-chooser-circle {
  stroke-width: 1px;
  stroke: white;
  fill: none;
}


/* ------ [ vec2 ] ------ */

.muigui-vec2 svg {
  background-color: var(--value-bg-color);
}

.muigui-vec2-axis {
  stroke: 1px;
  stroke: var(--focus-color);
}

.muigui-vec2-line {
  stroke-width: 1px;
  stroke: var(--value-color);
  fill: var(--value-color);
}

/* ------ [ direction ] ------ */

.muigui-direction svg {
  background-color: rgba(0,0,0,0.2);
}

.muigui-direction:focus-within svg {
  outline: none;
}
.muigui-direction-range {
  fill: var(--value-bg-color);
}
.muigui-direction svg:focus {
  outline: none;
}
.muigui-direction svg:focus .muigui-direction-range {
  stroke-width: 0.5px;
  stroke: var(--focus-color);
}

.muigui-direction-arrow {
  fill: var(--value-color);
}

/* ------ [ slider ] ------ */

.muigui-slider>div {
  display: flex;
  align-items: stretch;
  height: var(--line-height);
}
.muigui-slider svg {
  flex: 1 1 auto;
}
.muigui-slider .muigui-slider-up #muigui-orientation {
  transform: scale(1, -1) translateY(-100%);
}

.muigui-slider .muigui-slider-up #muigui-number-orientation {
  transform: scale(1,-1);
}

.muigui-ticks {
  stroke: var(--range-color);
}
.muigui-thicks {
  stroke: var(--color);
  stroke-width: 2px;
}
.muigui-svg-text {
  fill: var(--color);
  font-size: 7px;
}
.muigui-mark {
  fill: var(--value-color);
}

/* ------ [ range ] ------ */


.muigui-range input[type=range] {
  -webkit-appearance: none;
  appearance: none;
  background-color: transparent;
}

.muigui-range input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  border-radius: calc(var(--border-radius) + 2px);
  border-left: 1px solid rgba(255,255,255,0.3);
  border-top: 1px solid rgba(255,255,255,0.3);
  border-bottom: 1px solid rgba(0,0,0,0.2);
  border-right: 1px solid rgba(0,0,0,0.2);
  background-color: var(--range-color);
  margin-top: calc((var(--line-height) - 6px) / -2);
  width: calc(var(--line-height) - 6px);
  height: calc(var(--line-height) - 6px);
}

.muigui-range input[type=range]::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  appearance: none;
  border: 1px solid var(--menu-sep-color);
  height: 2px;
}


/* dat.gui style - doesn't work on Safari iOS */

/*
.muigui-range input[type=range] {
  cursor: ew-resize;
  overflow: hidden;
}

.muigui-range input[type=range] {
  -webkit-appearance: none;
  appearance: none;
  background-color: var(--range-right-color);
  margin: 0;
}
.muigui-range input[type=range]:hover {
  background-color: var(--range-right-hover-color);
}

.muigui-range input[type=range]::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  appearance: none;
  height: max-content;
  color: var(--range-left-color);
  margin-top: -1px;
}

.muigui-range input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0px;
  height: max-content;
  box-shadow: -1000px 0 0 1000px var(--range-left-color);
}
*/

/* FF */
/*
.muigui-range input[type=range]::-moz-slider-progress {
  background-color: var(--range-left-color); 
}
.muigui-range input[type=range]::-moz-slider-thumb {
  height: max-content;
  width: 0;
  border: none;
  box-shadow: -1000px 0 0 1000px var(--range-left-color);
  box-sizing: border-box;
}
*/

.muigui-checkered-background {
  background-color: #404040;
  background-image:
     linear-gradient(45deg, #808080 25%, transparent 25%),
     linear-gradient(-45deg, #808080 25%, transparent 25%),
     linear-gradient(45deg, transparent 75%, #808080 75%),
     linear-gradient(-45deg, transparent 75%, #808080 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
}

/* ---------------------------------------------------------- */

/* needs to be at bottom to take precedence */
.muigui-auto-place {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 100001;
}

`,
themes: {
  default: {
    include: ['default'],
    css: `
    `,
  },
  float: {
    include: ['default'],
    css: `
  :root {
    color-scheme: light dark,
  }

  .muigui {
    --width: 400px;
    --bg-color: initial;
    --label-width: 25%;
    --number-width: 20%;
  }

  input,
  .muigui-label-controller>label {
      text-shadow:
       -1px -1px 0 var(--contrast-color),
        1px -1px 0 var(--contrast-color),
       -1px  1px 0 var(--contrast-color),
        1px  1px 0 var(--contrast-color);
  }

  .muigui-controller > label:nth-child(1) {
      place-content: center end;
      margin-right: 1em;
  }

  .muigui-value > :nth-child(2) {
      margin-left: 1em;
  }

  .muigui-root>*:nth-child(1) {
      display: none;
  }

  .muigui-range input[type=range]::-webkit-slider-thumb {
    border-radius: 1em;
  }

  .muigui-range input[type=range]::-webkit-slider-runnable-track {
    -webkit-appearance: initial;
    appearance: none;
    border: 1px solid rgba(0, 0, 0, 0.25);
    height: 2px;
  }

  .muigui-colors {
    --value-color: var(--color  );
    --value-bg-color: rgba(0, 0, 0, 0.1);
    --disabled-color: #cccccc;
    --menu-bg-color: rgba(0, 0, 0, 0.1);
    --menu-sep-color: #bbbbbb;
    --hover-bg-color: rgba(0, 0, 0, 0);
    --invalid-color: #FF0000;
    --selected-color: rgba(0, 0, 0, 0.3);
    --range-color: rgba(0, 0, 0, 0.125);
  }
`,
  },
  form: {
    include: [],
    css: `
    .muigui {
      --width: 100%;
      --label-width: 45%;
      --number-width: 40%;
    }
    .muigui-root>button {
      display: none;
    }
    .muigui-controller {
      margin-top: 1em;
    }
    .muigui-label-controller {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      margin-top: 1em;
    }
    .muigui-label-controller:has(.muigui-checkbox) {
      flex-direction: row;
    }
    .muigui-value {
      display: flex;
      align-items: stretch;
    }
    .muigui-value>* {
      flex: 1 1 auto;
      min-width: 0;
    }
    .muigui-controller>*:nth-child(1) {
      flex: 1 0 var(--label-width);
      min-width: 0;
      white-space: pre;
    }
    .muigui-controller>label:nth-child(1) {
      place-content: center start;
      display: inline-grid;
      overflow: hidden;
    }
    .muigui-controller>*:nth-child(2) {
      flex: 1 1 75%;
      min-width: 0;
    }
  `,
  },
  none: {
    include: [],
    css: '',
  },
},
};

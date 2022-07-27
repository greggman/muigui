# To Do

- [ ] Tests
- [ ] Color RGB, HSL, LAB, Alpha? (just input=color for now?)
  - [x] red, green, blue color formats
    - [x] #RGB
    - [x] RGB
    - [x] #RRGGBB
    - [x] RRGGBB
    - [x] 0xRRGGBB
    - [x] [255, 255, 255]
    - [x] [1, 1, 1]
  - [ ] red, green, blue, alpha color formats

    note: the default color editor doesn't have alpha so this is a big ask.
    I think this is best as an extra add on since it requires a non-small
    amount of code to build a color editor? (actually, maybe I don't care about size)

    note: kind of leading toward not carrying about size and also
    making own color editor as the default one, at least in Chrome,
    kinda sucks.

    - [ ] 0xRRGGBBAA
    - [ ] #RRGGBBAA
    - [ ] [255, 255, 255, 255]
    - [ ] [1, 1, 1, 1]

  - [ ] hdr colors (this is really just not limited them to 1.0 on float colors, and/or CSS strings)
- [x] (no for now) wrapping slider? (0-360) 
- [x] (no for now) Direction? (an arrow, low-pri)
- [x] onChange
- [x] name
- [x] listen
- [x] update
- [x] disable
- [x] remove
- [x] hide
- [ ] fix 'period'. It's stepping by 0.1 and only going to 3.1
- [ ] camelCase to Camel Case
- [ ] get rid of min/max/step etc... as setters and add setOptions
- [ ] interval
- [ ] radio
- [ ] scroll wheel
- [ ] add ticks like volume control to direction (rename knob)
- [x] text red if invalid?
- [ ] fix editing text (forgot where it's failing)
- [ ] what should 0x123 do for hex colors because we want it to be 0x000123. I guess it just works.
- [ ] angle (circle with arrow) - both display, and editor
- [ ] slider with ticks and number
- [ ] circle input (circle with 2 arrows) - both display and editor
- [ ] add keyboard controls to direction
- [ ] add keyboard controls to vec2
- [ ] add keyboard controls to color picker
- [x] Label (not interactive)
- [x] Label multi line (use as log) 
- [x] ask for file? (nah, drag and drop is better)
- [ ] styles (form)
- [x] deg to rad 
- [x] fix step with conversions
- [x] format slider number?
- [ ] TextArea (edit larger text)
  - [ ] pop-out text (or expand in place?)
- [ ] submenus
- [x] menu open/close
- [x] scroll on long (css)
- [ ] x, y, z
- [x] copy paste all (no, what would that even look like? right click? Shift-Ctrl-C?)
- [x] single line text
- [x] splitter
- [x] functions to query colors?
- [x] (doesn't work) maybe just add color-scheme to CSS
- [ ] make svg ids start with muigui
- [ ] on enter in text field we need to invalidate value cache
- [ ] add all
  - [ ] add with filter? (pass in filter so you can make positive or negative)
  - [ ] add with list of fields?
  - [ ] list of options by field name
  - [ ] recursive (max depth?)
  - [ ] match by instanceof ?
  - [ ] let user provide matcher?
- [x] add hover for long name
- [ ] try making custom controllers. In particular a list editor like unity
- [x] fix "RGB"
- [x] fix first column when changing width
- [x] do autoplace test
- [ ] Create layout units? Instead of using CSS directly on types maybe make
      components that do nothing but layout?
      `Column`, `Row`, etc. Then for layout it becomes

      Column[
        title,
        Column[
          Row[
            Column[label, Color, Text],
          ],
          Row[
            Column[label, Slider, Number],
          ]
          Row[
            Button,
          ]
        ],
      ]

    No idea if that makes sense

- [ ] try to refactor Text, Number, Slider, Color, Checkbox, etc, into more reusable components
      so you can combine them into a new component. Like ideally an X,Y,Z might be
      3 sliders. So maybe instead of Checkbox extends ValueComponent it should just
      `ValueComponent.add(new Checkbox())` or something to that effect. Same with ValueComponent
      vs Component. Maybe it's `Component.add(new ValueComponent())`

      Can we separate text and number and reuse them?

- [x] auto step (not going to do this for now)
- [x] fix can't enter trailing '.' on input number (FF only?) (maybe don't set text when value from text)
- [x] consider more explicit layout
  - [x] (1 part, 2 parts, 3 parts) or (1 part, 2 parts where 3 is [[1][2[1][2]]])
- [ ] Docs
- [ ] API docs (jsdoc)
- [ ] TypeScript 
- [x] add folder.onChange/onFinishChange
- [x] Fix Safari Style
- [x] Fix Safari overflow on long names
- [x] Change menu to button or at least make it so you can focus
- [x] add focus to color
- [x] fix disabled so it disables all inputs (otherwise focus goes there)

---

- [ ] look into add without object. eg

  ```js
  gui.addButton(title, fn);
  gui.addSlider(title, get, set, min, max, step);
  gui.addNumber(title, get, set, converter, step);
  gui.addText(title, get, set);
  gui.addCheckbox(title, get, set);
  gui.addColor(title, get, set, format);
  ```

  or

  ```js
  gui.addController(new Button(title, fn));
  gui.addController(new Slider(title, get, set, min, max, step));
  gui.addController(new Number(title, get, set, converter, step));
  gui.addController(new Text(title, get, set));
  gui.addController(new Checkbox(title, get, set));
  gui.addController(new Color(title, get, set, format));
  ```

  It's kind of gross but given this is probably a not a common desire, if you really want to mod a
  local variable you can do this

  ```js
  let temperature = 72.0;

  const helper = {
    get v() { return temperature; }
    set v(newV) { temperature = newV; }
  };

  gui.add(helper, 'v').name('temperature');
  ```


  The second is arguably better than the first? The first is cluttered API, having to add every widget.
  Sadly the `addColor` and `addFolder` are already the expected API 😭

# To Do

- [ ] Tests
- [ ] Color RGB, HSL, LAB, Alpha? (just input=color for now?)
  - [x] #RGB
  - [x] RGB
  - [x] #RRGGBB
  - [x] RRGGBB
  - [x] 0xRRGGBB;
  - [x] [255, 255, 255],
  - [x] [1, 1, 1],
  - [ ] 0xRRGGBBAA - not: the default color editor doesn't have alpha so this is a big ask. I think this is best as an extra add on?
  - [ ] #RRGGBBAA
  - [ ] [255, 255, 255, 255],
  - [ ] [1, 1, 1, 1],
- [x] (no for now) wrapping slider? (0-360) 
- [x] (no for now) Direction? (an arrow, low-pri)
- [x] onChange
- [x] name
- [x] listen
- [x] update
- [x] disable
- [x] remove
- [x] hide
- [ ] scroll wheel
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
- [ ] scroll on long (css)
- [ ] x, y, z
- [x] copy paste all (no, what would that even look like? right click? Shift-Ctrl-C?)
- [x] single line text
- [x] splitter
- [x] functions to query colors?
- [x] (doesn't work) maybe just add color-scheme to CSS
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
- [ ] do autoplace test
- [ ] try to refactor Text, Number, Slider, Color, Checkbox, etc, into more reusable components
      so you can combine them into a new component. Like ideally an X,Y,Z might be
      3 sliders. So maybe instead of Checkbox extends ValueComponent it should just
      `ValueComponent.add(new Checkbox())` or something to that effect. Same with ValueComponent
      vs Component. Maybe it's `Component.add(new ValueComponent())`
- [x] auto step (not going to do this for now)
- [x] fix can't enter trailing '.' on input number (FF only?) (maybe don't set text when value from text)
- [x] consider more explicit layout
  - [x] (1 part, 2 parts, 3 parts) or (1 part, 2 parts where 3 is [[1][2[1][2]]])
- [ ] look into add without object. eg

  ```
  gui.addButton(title, fn);
  gui.addSlider(title, get, set, min, max, step);
  gui.addNumber(title, converter, step);
  gui.addText(title, get, set);
  gui.addCheckbox(title, get, set);
  gui.addColor(title, get, set, format);
  ```

  or

  ```
  gui.addController(new Button(title, fn));
  gui.addController(new Slider(title, get, set, min, max, step));
  gui.addController(new Number(title, converter, step));
  gui.addController(new Text(title, get, set));
  gui.addController(new Checkbox(title, get, set));
  gui.addController(new Color(title, get, set, format));
  ```

  The second is arguably better than the first? The first is cluttered API, having to add every widget.
  Sadly the `addColor` and `addFolder` are already the expected API 😭

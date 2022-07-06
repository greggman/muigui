# To Do

- [ ] Tests
- [ ] Color RGB, HSL, LAB, Alpha? (just input=color for now?)
  - [x] #RGB
  - [ ] RGB
  - [x] #RRGGBB
  - [x] RRGGBB
  - [ ] #RRGGBBAA
  - [ ] 0xRRGGBB;
  - [x] [255, 255, 255],
  - [ ] [255, 255, 255, 255],
  - [x] [1, 1, 1],
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
- [ ] scrollwheel?
- [ ] Label (not interactive)
- [ ] Label multi line (use as log) 
- [ ] ask for file? (nah, drag and drop is better)
- [ ] styles (form)
- [x] deg to rad 
- [ ] fix step with conversions
- [ ] format slider number?
- [ ] TextArea (edit larger text)
- [ ] submenus
- [x] menu open/close
- [ ] scroll on long (css)
- [ ] x, y, z
- [ ] copy paste all (???)
- [ ] single line text
- [ ] splitter
- [ ] popout text (or expand in place?)
- [ ] functions to query colors
- [ ] maybe just add color-scheme to CSS
- [ ] add all
  - [ ] add with filter? (pass in filter so you can make positive or negative)
  - [ ] add with list of fields?
  - [ ] list of options by field name
  - [ ] recursive (max depth?)
  - [ ] match by instanceof ?
  - [ ] let user provide matcher?
- [ ] look into add without object. eg
    ```
    gui.addButton('title', fn);
    ```
- [x] add hover for long name
- [ ] try making custom controllers. In particular a list editor like unity
- [ ] fix "RGB"
- [ ] fix first column when changing width
- [ ] do autoplace test
- [x] auto step (not going to do this for now)
- [x] fix can't enter trailing '.' on input number (FF only?) (maybe don't set text when value from text)
- [ ] consider more explicit layout
  - [ ] (1 part, 2 parts, 3 parts) or (1 part, 2 parts where 3 is [[1][2[1][2]]])
  
  ```
  gui.addButton(title, fn);
  gui.addSlider(title, get, set, min, max, step);
  gui.addText(title, get, set)
  gui.addCheckbox(title, get, set);
  gui.addColor(title, get, set, format)
  ```
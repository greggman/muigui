# muigui

Not ready

<!--
<img src="./images/muigui.png" style="max-width: 640px">

A simple Web UI library.

muigui is a simple UI library in the spirit of
[dat.gui](https://github.com/dataarts/dat.gui) and/or [lil-gui](https://github.com/georgealways/) of [tweakpane](https://cocopon.github.io/tweakpane/)

## Usage

```js
import GUI from 'https://muigui.org/dist/0.x/muigui.module.js';
```

or

```html
<script src="https://muigui.org/dist/0.x/muigui.min.js"></script>
```

Then

```js
const s = {
  someNumber: 123,
  someString: "hello",
  someOption: "dog",
  someColor: '#ED3281',
  someFunction: () => console.log('called')
};

const gui = new GUI();
gui.add(s, 'someNumber', 0, 200);  // range 0 to 200
gui.add(s, 'someString);
gui.add(s, 'someOption, ['cat', 'bird', 'dog']);
gui.addColor(s, 'someColor');
gui.add(s, 'someFunction');
```

produces

<img src="./images/muigui-screenshot.png" style="max-width: 275px">

or a shorter version

```js
const s = {
  someNumber: 123,
  someString: "hello",
  someOption: "dog",
  someColor: '#ED3281',
  someFunction: () => console.log('called')
};

const options = {
  someNumber: [1, 200],   // range 0 to 200
  someOption: ['cat', 'bird', 'dog'],
}

const gui = new GUI();
gui.add(s, options);
```

## What

It is not a general purpose library for every type of GUI.
Rather, it is a small, easy to use library for small apps.
Basically I liked how simple it was to use dat.gui to add
a few sliders and options to a demo.

I thought I'd try to make a CSS/DOM based UI standard elements
only and then require CSS to style it and see how far I got.

### Not invented here syndrome

It's possible this already exists but if so I couldn't find it.
Most UI libraries seem to be giant and require a build step.
I wanted something hopefully not too big and something I could
easily add to any example with 1 file (or 2 if you add CSS).

# Why another GUI library?

There are things I wanted to explore

*  Common use-cases are not covered by the other libraries

   The most common example for me is editing an angle that the code
   wants to be in radians but the UI wants to be in degrees. It's possible
   in the other libraries but requires a bunch of boilerplate.
   Other examples might be feet vs meters, fahrenheit vs celsius,
   or just converting any range from [0 to 1] to [a to b] or visa versa.

*  More modular

   I'm still working on this but ideally I'd like the UI parts to
   be made from building blocks so that making a new UI is just a
   matter of combining existing parts.

*  Form Usage

   I like the API of these libraries but they build a drop-down UI
   meant for tweaking a few visual demo values. I'd like to be able
   to use the same API and code for a standard HTML form. I find that
   when I have to write such a form, I end up coding by hand and am
   disappointed I can't use the UI library I'm used to. It's possible
   this will be a mis-match between these UIs are usually meant for
   real-time updating and with forms you generally don't want to update
   until the user clicks submit but I'm not sure that matters as you
   can just make a temporary object to edit and copy it when the user
   clicks submit.

*  Auto UI generation

   Way back in 2000 when C# shipped, one of the most amazing features
   was the PropertyEditor. You'd add it to your UI, give it a reference
   to an object, and it would magically generate a UI to edit all of
   the public properties of that object.

   You could then start adding custom UIs for classes (like `Color`)
   so that instead of 4 numbers it would display a color picker.

   I'd like to experiment with something similar here. I'm not entirely
   sure it makes sense or not. There are multiple issues here.

   * C# and similar languages make it relatively easy to serialize
     and deserialize full classes where as JavaScript just has JSON
     and you have to write your own serialization to re-create objects.

     To be honest, that seems fine as I've rarely serialized anything
     from these UI libraries but I know others use that feature. In fact
     the original dat.GUI made a point of being able to save and resort
     settings.

     The point though is, in a typed language it's easy to write some
     code that is like

         if (value instanceof Color) ... make a Color UI
         if (value instanceof Spline) ... make a Spline UI

     While we can do that in JavaScript we can't nearly as easily
     serialize and deserialize `Color` and `Spline`

   * It's common to use untyped values in JavaScript

     For example in dat.GUI, to edit a string vs a color you call a different
     function.

     ```js
     const s = {
        name: 'Clare',
        color: '#FF8844',
     };

     const gui = new GUI();
     gui.add(s, 'name');       // makes a string editor
     gui.addColor(s, 'color'); // makes a color editor
     ```

     In some ideal world the API could figure out that `color` needs a color
     editor. Back to the previous issue, in C# that's done by type.

     I'm not sure what to do here. One would be to pass in field names
     and what to make them. Another would be pass in a filter function
     so you could do more fancy selection, like say, anything that ends
     in `Color` gets a color editor. Or anything that starts with `c`
     or whatever criteria you want.

## muigui - wat?

https://user-images.githubusercontent.com/234804/177000460-3449c2dd-da94-4119-903f-cc7460b46e7b.mp4

-->

## License

[MIT](https://github.com/greggman/muigui/blob/main/LICENSE.md)

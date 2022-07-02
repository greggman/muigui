import Button from './button.js';
import Checkbox from './checkbox.js';
import Select from './select.js';
import Slider from './slider.js';

/**
 * possible inputs
 *    add(o, p, min: number, max: number)
 *    add(o, p, min: number, max: number, step: number)
 *    add(o, p, obj: key-value)
 *    add(o, p, array: [value])
 *    add(o, p, array: [[key, value]])
 * 
 * @param {*} object 
 * @param {string} property 
 * @param  {...any} args 
 * @returns 
 */
export function createWidget(object, property, ...args) {
  const [arg1] = args;
  const arg1IsObject = typeof arg1 === 'object';
  if (arg1IsObject) {
    return new Select(object, property, ...args);
  }

  const t = typeof object[property];
  switch (t) {    
    case 'number':
      return new Slider(object, property, ...args);
    case 'boolean':
      return new Checkbox(object, property, ...args);
    case 'function':
      return new Button(object, property, ...args);
    case 'string':
      return new Text(object, property, ...args);
  }
}
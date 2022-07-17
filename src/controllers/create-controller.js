import Button from './button.js';
import Checkbox from './checkbox.js';
import TextNumber from './text-number.js';
import Select from './select.js';
import Slider from './slider.js';
import Text from './text.js';

const isConversion = o => typeof o.to === 'function' && typeof o.from === 'function';

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
 * @returns {Controller}
 */
export function createController(object, property, ...args) {
  const [arg1] = args;
  const arg1IsObject = typeof arg1 === 'object';
  if (arg1IsObject && !isConversion(arg1)) {
    return new Select(object, property, ...args);
  }

  const t = typeof object[property];
  switch (t) {
    case 'number':
      return args.length === 0 || (args.length <= 2 && typeof args[0] === 'object')
          ? new TextNumber(object, property, ...args)
          : new Slider(object, property, ...args);
    case 'boolean':
      return new Checkbox(object, property, ...args);
    case 'function':
      return new Button(object, property, ...args);
    case 'string':
      return new Text(object, property, ...args);
    default:
      throw new Error('unhandled type');
  }
}
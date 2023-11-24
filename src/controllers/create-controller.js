import Button from './Button.js';
import Checkbox from './Checkbox.js';
import TextNumber from './TextNumber.js';
import Select from './Select.js';
import Range from './Range.js';
import Text from './Text.js';

// const isConversion = o => typeof o.to === 'function' && typeof o.from === 'function';

/**
 * possible inputs
 *    add(o, p, min: number, max: number)
 *    add(o, p, min: number, max: number, step: number)
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
  if (Array.isArray(arg1)) {
    return new Select(object, property, {keyValues: arg1});
  }

  const t = typeof object[property];
  switch (t) {
    case 'number':
      if (typeof args[0] === 'number' && typeof args[1] === 'number') {
        const min = args[0];
        const max = args[1];
        const step = args[2];
        return new Range(object, property, {min, max, ...(step && {step})});
      }
      return args.length === 0
          ? new TextNumber(object, property, ...args)
          : new Range(object, property, ...args);
    case 'boolean':
      return new Checkbox(object, property, ...args);
    case 'function':
      return new Button(object, property, ...args);
    case 'string':
      return new Text(object, property, ...args);
    case 'undefined':
      throw new Error(`no property named ${property}`);
    default:
      throw new Error(`unhandled type ${t} for property ${property}`);
  }
}
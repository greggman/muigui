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
export function createController(object: any, property: string, ...args: any[]): Controller;

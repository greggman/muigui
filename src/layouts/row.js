import Layout from './layout.js';

export default class Row extends Layout {
  constructor(className = '') {
    super(['muigui-row', className]);
  }
}
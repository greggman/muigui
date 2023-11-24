import { createElem } from '../libs/elem.js';
import View from './View.js';

export default class ElementView extends View {
  constructor(tag, className) {
    super(createElem(tag, {className}));
  }
}
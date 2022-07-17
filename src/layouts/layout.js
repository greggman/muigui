import { createElem } from '../libs/elem.js';
import View from '../base-components/view.js';
import { classNamesToStr } from '../libs/css-utils.js';

export default class Layout extends View {
  constructor(className, tag = 'div') {
    super(createElem(tag, {className: classNamesToStr(className)}));
  }
}
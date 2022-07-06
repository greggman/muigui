import Controller from './controller.js';

// This feels like it should be something else like
// gui.addController({className: 'muigui-divider')};
export default class Divider extends Controller {
  constructor() {
    super('muigui-divider');
  }
}
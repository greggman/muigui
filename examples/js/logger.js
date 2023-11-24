export default class Logger {
  constructor(maxLines = 3) {
    let logController;

    const lines = [];
    this.log = (...args) => {
      lines.push(args.join(' '));
      if (lines.length > maxLines) {
        lines.shift();
      }
      logController.text(lines.join('\n'));
    };

    this.setController = (controller) => {
      logController = controller;
    };
  }
}


export default class Controller extends View {
    constructor(className: any);
    get parent(): any;
    setParent(parent: any): void;
    show(show?: boolean): this;
    hide(): this;
    disabled(): boolean;
    enable(enable?: boolean): this;
    disable(disable?: boolean): this;
    onChange(fn: any): this;
    removeChange(fn: any): this;
    onFinishChange(fn: any): this;
    removeFinishChange(fn: any): this;
    emitChange(value: any, object: any, property: any): void;
    emitFinalChange(value: any, object: any, property: any): void;
    updateDisplay(): void;
    getColors(): any;
    #private;
}
import View from '../views/View.js';

export default class ValueController extends LabelController {
    constructor(object: any, property: any, className?: string);
    get initialValue(): any;
    get object(): any;
    get property(): any;
    add(view: any): any;
    setValue(v: any): void;
    setFinalValue(v: any): this;
    updateDisplay(ignoreCache: any): this;
    setOptions(options: any): this;
    getValue(): any;
    value(v: any): this;
    reset(): this;
    listen(listen?: boolean): this;
    #private;
}
import LabelController from './LabelController.js';

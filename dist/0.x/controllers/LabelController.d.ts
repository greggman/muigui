export default class LabelController extends Controller {
    constructor(className?: string, name?: string);
    get id(): string;
    name(name: any): this;
    tooltip(tip: any): void;
    #private;
}
import Controller from './Controller.js';

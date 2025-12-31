export default class Container extends Controller {
    get children(): any[];
    get controllers(): any[];
    get folders(): any[];
    reset(recursive?: boolean): this;
    updateDisplay(): this;
    remove(controller: any): this;
    addController(controller: any): any;
    pushContainer(container: any): any;
    popContainer(): this;
    listen(listen?: boolean): this;
    #private;
}
import Controller from './Controller.js';

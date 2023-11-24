export default class Folder extends Container {
    constructor(name?: string, className?: string);
    open(open?: boolean): this;
    close(): this;
    name(name: any): this;
    title(title: any): this;
    toggleOpen(): this;
    #private;
}
import Container from './Container.js';

export class GUIFolder extends Folder {
    add(object: any, property: any, ...args: any[]): any;
    addCanvas(name: any): any;
    addColor(object: any, property: any, options?: {}): any;
    addDivider(): any;
    addFolder(name: any): any;
    addLabel(text: any): any;
    addButton(name: any, fn: any): any;
}
export class GUI extends GUIFolder {
    static converters: {
        radToDeg: {
            to: (v: any) => any;
            from: (v: any) => any[];
        };
    };
    static mapRange: (v: any, inMin: any, inMax: any, outMin: any, outMax: any) => any;
    static makeRangeConverters: ({ from, to }: {
        from: any;
        to: any;
    }) => {
        to: (v: any) => any;
        from: (v: any) => any[];
    };
    static makeRangeOptions: ({ from, to, step }: {
        from: any;
        to: any;
        step: any;
    }) => any;
    static makeMinMaxPair: typeof makeMinMaxPair;
    static setBaseStyles(css: any): void;
    static getBaseStyleSheet(): CSSStyleSheet;
    static setUserStyles(css: any): void;
    static getUserStyleSheet(): CSSStyleSheet;
    static setTheme(name: any): void;
    constructor(options?: {});
    setStyle(css: any): void;
    setTheme(name: any): void;
    #private;
}
export default GUI;
import Column from './layout/Column.js';
import Frame from './layout/Frame.js';
import Grid from './layout/Grid.js';
import Row from './layout/Row.js';
import Folder from './controllers/Folder.js';
import { makeMinMaxPair } from './libs/utils.js';
export { Column, Frame, Grid, Row };

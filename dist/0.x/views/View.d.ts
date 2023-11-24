export default class View {
    #private;
    domElement: HTMLElement;
    constructor(elem: HTMLElement);
    addElem(elem: HTMLElement): HTMLElement;
    removeElem(elem: HTMLElement): HTMLElement;
    pushSubElem(elem: HTMLElement): void;
    popSubElem(): void;
    add(view: View): View;
    remove(view: View): View;
    pushSubView(view: View): void;
    popSubView(): void;
    setOptions(options: any): void;
    updateDisplayIfNeeded(newV: any, ignoreCache?: boolean): this;
    $(selector: string): Element | null;
}

export function computeRelativePosition(elem: any, event: any, start: any): {
    x: number;
    y: number;
    nx: number;
    ny: number;
    dx: number;
    dy: number;
    ndx: number;
    ndy: number;
};
export function addTouchEvents(elem: any, { onDown, onMove, onUp }: {
    onDown?: typeof noop | undefined;
    onMove?: typeof noop | undefined;
    onUp?: typeof noop | undefined;
}): () => void;
declare function noop(): void;
export {};

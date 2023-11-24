export function removeArrayElem(array: any, value: any): any;
export function idToLabel(id: any): any;
export function clamp(v: any, min: any, max: any): number;
export function copyExistingProperties(dst: any, src: any): any;
export function makeMinMaxPair(gui: any, properties: any, minPropName: any, maxPropName: any, options: any): any[];
export function isTypedArray(a: any): any;
export function isArrayOrTypedArray(v: any): any;
export function stepify(v: any, from: any, step: any): number;
export function euclideanModulo(v: any, n: any): number;
export function lerp(a: any, b: any, t: any): any;
export function mapRange(v: any, inMin: any, inMax: any, outMin: any, outMax: any): any;
export function makeRangeConverters({ from, to }: {
    from: any;
    to: any;
}): {
    to: (v: any) => any;
    from: (v: any) => any[];
};
export function makeRangeOptions({ from, to, step }: {
    from: any;
    to: any;
    step: any;
}): any;
export namespace identity {
    function to(v: any): any;
    function from(v: any): any[];
}

export namespace identity {
    function to(v: any): any;
    function from(v: any): any[];
}
export namespace strToNumber {
    export function to_1(v: any): any;
    export { to_1 as to };
    export function from_1(v: any): (number | boolean)[];
    export { from_1 as from };
}
export namespace converters {
    let radToDeg: {
        to: (v: any) => any;
        from: (v: any) => any[];
    };
}

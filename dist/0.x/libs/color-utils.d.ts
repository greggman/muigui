export function hslToRgbUint8([h, s, l]: [any, any, any]): number[];
export function hslaToRgbaUint8([h, s, l, a]: [any, any, any, any]): number[];
export function rgbFloatToHsl01([r, g, b]: [any, any, any]): number[];
export function rgbaFloatToHsla01([r, g, b, a]: [any, any, any, any]): any[];
export function hsv01ToRGBFloat([hue, sat, val]: [any, any, any]): number[];
export function hsva01ToRGBAFloat([hue, sat, val, alpha]: [any, any, any, any]): any[];
export function rgbFloatToHSV01([r, g, b]: [any, any, any]): number[];
export function rgbaFloatToHSVA01([r, g, b, a]: [any, any, any, any]): any[];
export function guessFormat(v: any): string;
export function hexToUint8RGB(v: any): number[];
export function uint8RGBToHex(v: any): string;
export function hexToUint8RGBA(v: any): number[];
export function uint8RGBAToHex(v: any): string;
export function hexToFloatRGB(v: any): number[];
export function floatRGBToHex(v: any): string;
export function hexToFloatRGBA(v: any): number[];
export function floatRGBAToHex(v: any): string;
export function rgbUint8ToHsl(rgb: any): number[];
export function rgbaUint8ToHsla(rgba: any): any[];
export function hasAlpha(format: any): any;
export const colorFormatConverters: {
    hex6: {
        color: {
            from: (v: any) => any[];
            to: typeof fixHex6;
        };
        text: {
            from: (v: any) => any[];
            to: (v: any) => any;
        };
    };
    hex8: {
        color: {
            from: (v: any) => any[];
            to: typeof fixHex8;
        };
        text: {
            from: (v: any) => any[];
            to: (v: any) => any;
        };
    };
    hex3: {
        color: {
            from: (v: any) => any[];
            to: typeof hex3ToHex6;
        };
        text: {
            from: (v: any) => any[];
            to: (v: any) => any;
        };
    };
    'hex6-no-hash': {
        color: {
            from: (v: any) => any[];
            to: (v: any) => string;
        };
        text: {
            from: (v: any) => any[];
            to: (v: any) => any;
        };
    };
    'hex8-no-hash': {
        color: {
            from: (v: any) => any[];
            to: (v: any) => string;
        };
        text: {
            from: (v: any) => any[];
            to: (v: any) => any;
        };
    };
    'hex3-no-hash': {
        color: {
            from: (v: any) => any[];
            to: typeof hex3ToHex6;
        };
        text: {
            from: (v: any) => any[];
            to: (v: any) => any;
        };
    };
    'uint32-rgb': {
        color: {
            from: (v: any) => (number | boolean)[];
            to: (v: any) => string;
        };
        text: {
            from: (v: any) => (number | boolean)[];
            to: (v: any) => string;
        };
    };
    'uint32-rgba': {
        color: {
            from: (v: any) => (number | boolean)[];
            to: (v: any) => string;
        };
        text: {
            from: (v: any) => (number | boolean)[];
            to: (v: any) => string;
        };
    };
    'uint8-rgb': {
        color: {
            from: (v: any) => (boolean | number[])[];
            to: (v: any) => string;
        };
        text: {
            from: (s: any) => (boolean | number[])[];
            to: (v: any) => any;
        };
    };
    'uint8-rgba': {
        color: {
            from: (v: any) => (boolean | number[])[];
            to: (v: any) => string;
        };
        text: {
            from: (s: any) => (boolean | number[])[];
            to: (v: any) => any;
        };
    };
    'float-rgb': {
        color: {
            from: (v: any) => (boolean | number[])[];
            to: (v: any) => string;
        };
        text: {
            from: (s: any) => any[];
            to: (v: any) => string;
        };
    };
    'float-rgba': {
        color: {
            from: (v: any) => (boolean | number[])[];
            to: (v: any) => string;
        };
        text: {
            from: (s: any) => any[];
            to: (v: any) => string;
        };
    };
    'object-rgb': {
        color: {
            from: (v: any) => (boolean | {
                r: number;
                g: number;
                b: number;
            })[];
            to: (v: any) => string;
        };
        text: {
            from: (s: any) => any[];
            to: (rgb: any) => string;
        };
    };
    'object-rgba': {
        color: {
            from: (v: any) => (boolean | {
                r: number;
                g: number;
                b: number;
                a: number;
            })[];
            to: (v: any) => string;
        };
        text: {
            from: (s: any) => any[];
            to: (rgba: any) => string;
        };
    };
    'css-rgb': {
        color: {
            from: (v: any) => (string | boolean)[];
            to: (v: any) => string;
        };
        text: {
            from: (s: any) => (string | boolean)[];
            to: (v: any) => string | boolean;
        };
    };
    'css-rgba': {
        color: {
            from: (v: any) => (string | boolean)[];
            to: (v: any) => string;
        };
        text: {
            from: (s: any) => (string | boolean)[];
            to: (v: any) => string | boolean;
        };
    };
    'css-hsl': {
        color: {
            from: (v: any) => (string | boolean)[];
            to: (v: any) => string;
        };
        text: {
            from: (s: any) => (string | boolean)[];
            to: (v: any) => string | boolean;
        };
    };
    'css-hsla': {
        color: {
            from: (v: any) => (string | boolean)[];
            to: (v: any) => string;
        };
        text: {
            from: (s: any) => (string | boolean)[];
            to: (v: any) => string | boolean;
        };
    };
};
declare function fixHex6(v: any): any;
declare function fixHex8(v: any): any;
declare function hex3ToHex6(hex3: any): any;
export {};

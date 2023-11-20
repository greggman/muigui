import {describe, it} from '../mocha-support.js';
import {
  assertArrayEqualApproximately,
  assertEqual,
} from '../assert.js';
import {
  colorFormatConverters,
  guessFormat,
  hsv01ToRGBFloat,
  rgbFloatToHSV01,
} from '../../src/libs/color-utils.js';

describe('color-utils tests', () => {

  it('guesses the correct color format', () => {
    assertEqual(guessFormat('#569AEF'), 'hex6');
    assertEqual(guessFormat('EF569A'), 'hex6-no-hash');
    assertEqual(guessFormat('#F88'), 'hex3');
    assertEqual(guessFormat('8F8'), 'hex3-no-hash');
    assertEqual(guessFormat('rgb(170,68,240)'), 'css-rgb');
    assertEqual(guessFormat('hsl(170,68%,80%)'), 'css-hsl');
    assertEqual(guessFormat(0xFEA956), 'uint32-rgb');
    assertEqual(guessFormat([255, 192, 255]), 'float-rgb'); // we can't really distinguish between [u8, u8, u8] and [float, float, float]
    assertEqual(guessFormat([0.2, 0.9, 0.5]), 'float-rgb');
    assertEqual(guessFormat(new Float32Array([0.2, 0.9, 0.5])), 'float-rgb');
    assertEqual(guessFormat(new Uint8Array([20, 90, 50])), 'uint8-rgb');
    assertEqual(guessFormat({r: 0, g: 0, b: 1}), 'object-rgb');
  });

  it('converts to/from css-rgb', () => {
    const {
      color: {from: fromHex, to: toHex},
      text: {from: fromStr, to: toStr},
    } = colorFormatConverters['css-rgb'];
    assertEqual(fromHex('#123456'), [true, 'rgb(18, 52, 86)']);
    assertEqual(toHex('rgb(86, 52, 18)'), '#563412');
    assertEqual(fromStr('rgb(1,22,33)'), [true, 'rgb(1, 22, 33)']);
    assertEqual(toStr('rgb(111,22,33)'), 'rgb(111, 22, 33)');
  });

  it('converts to/from css-hsl', () => {
    const {
      color: {from: fromHex, to: toHex},
      text: {from: fromStr, to: toStr},
    } = colorFormatConverters['css-hsl'];
    assertEqual(fromHex('#eed4c9'), [true, 'hsl(18, 52%, 86%)']);
    assertEqual(toHex('hsl(86, 52%, 18%)'), '#314616');
    assertEqual(fromStr('hsl(1,22%,33%)'), [true, 'hsl(1, 22%, 33%)']);
    assertEqual(toStr('hsl(111,22%,33%)'), 'hsl(111, 22%, 33%)');
    assertEqual(fromHex('#eeeeee'), [true, 'hsl(0, 0%, 93%)']);
  });

  it('converts to/from hex6-no-hash', () => {
    const {
      color: {from: fromHex, to: toHex},
      text: {from: fromStr, to: toStr},
    } = colorFormatConverters['hex6-no-hash'];
    assertEqual(fromHex('#123456'), [true, '123456']);
    assertEqual(toHex('123456'), '#123456');
    assertEqual(fromStr(' 123456 '), [true, '123456']);
    assertEqual(toStr('123456'), '123456');
  });

  it('converts to/from hex3', () => {
    const {
      color: {from: fromHex, to: toHex},
      text: {from: fromStr, to: toStr},
    } = colorFormatConverters['hex3'];
    assertEqual(fromHex('#123456'), [true, '#123456']);
    assertEqual(fromHex('#223355'), [true, '#235']);
    assertEqual(toHex('#123'), '#112233');
    assertEqual(fromStr(' #123 '), [true, '#123']);
    assertEqual(toStr('#456'), '#456');
  });

  it('converts to/from hex6', () => {
    const {
      color: {from: fromHex, to: toHex},
      text: {from: fromStr, to: toStr},
    } = colorFormatConverters['hex6'];
    assertEqual(fromHex('#123456'), [true, '#123456']);
    assertEqual(fromHex('#223355'), [true, '#223355']);
    assertEqual(toHex('#123456'), '#123456');
    assertEqual(fromStr(' #123456 '), [true, '#123456']);
    assertEqual(fromStr(' #123456f '), [false, '#123456f']);
    assertEqual(toStr('#456789'), '#456789');
  });

  it('converts to/from float-rgb', () => {
    const {
      color: {from: fromHex, to: toHex},
      text: {from: fromStr, to: toStr},
    } = colorFormatConverters['float-rgb'];
    assertEqual(fromHex('#123456'), [true, [0.071, 0.204, 0.337]]);
    assertEqual(toHex([0.337, 0.204, 0.071]), '#563412');
    assertEqual(fromStr('0.10 , 12.2301, 1.00'), [true, [0.1, 12.23, 1]]);
    assertEqual(fromStr('0.10 , 12.2301, 1.00f'), [false, [0.1, 12.23, 1]]);
    assertEqual(toStr([0.12, 0.34, 5.67]), '0.12, 0.34, 5.67');
    assertEqual(toStr(new Float32Array([0.2, 0.9, 0.5])), '0.2, 0.9, 0.5');
  });

  it('converts from/too hsv01/rgbFloat', () => {
    assertArrayEqualApproximately(rgbFloatToHSV01([1, 0, 0]), [0, 1, 1], 0.001);
    assertArrayEqualApproximately(rgbFloatToHSV01([0, 1, 0]), [1 / 3, 1, 1], 0.001);
    assertArrayEqualApproximately(rgbFloatToHSV01([0, 0, 1]), [2 / 3, 1, 1], 0.001);
    assertArrayEqualApproximately(hsv01ToRGBFloat([0, 1, 1]), [1, 0, 0], 0.0);
    assertArrayEqualApproximately(hsv01ToRGBFloat([1 / 3, 1, 1]), [0, 1, 0], 0.0);
    assertArrayEqualApproximately(hsv01ToRGBFloat([2 / 3, 1, 1]), [0, 0, 1], 0.00001);
    assertArrayEqualApproximately(hsv01ToRGBFloat([1 / 6, 1, 1]), [1, 1, 0], 0.0);
    assertArrayEqualApproximately(hsv01ToRGBFloat([3 / 6, 1, 1]), [0, 1, 1], 0.0);
    assertArrayEqualApproximately(hsv01ToRGBFloat([5 / 6, 1, 1]), [1, 0, 1], 0.00001);
  });

});
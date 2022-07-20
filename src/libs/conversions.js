export const identity = {from: v => v, to: v => [true, v] };

// from: from value to string
// to: from string to value
export const strToNumber = {
  from: v => v.toString(),
  to: v => {
    const newV = parseFloat(v);
    return [!Number.isNaN(newV), newV];
  },
};

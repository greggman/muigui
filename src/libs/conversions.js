export const identity = {
  to: v => v,
  from: v => [true, v],
};

// from: from string to value
// to: from value to string
export const strToNumber = {
  to: v => v.toString(),
  from: v => {
    const newV = parseFloat(v);
    return [!Number.isNaN(newV), newV];
  },
};

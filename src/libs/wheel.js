export function createWheelHelper() {
  let wheelAccum = 0;
  return function (e, step, wheelScale = 5) {
    wheelAccum -= e.deltaY * step / wheelScale;
    const wheelSteps = Math.floor(Math.abs(wheelAccum) / step) * Math.sign(wheelAccum);
    const delta = wheelSteps * step;
    wheelAccum -= delta;
    return delta;
  };
}

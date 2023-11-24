export function assert(truthy, msg = '') {
  if (!truthy) {
    throw new Error(msg);
  }
}
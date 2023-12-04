export function monitor(label, object, property, {interval = 200} = {}) {
  setInterval(() => {
    label.text(JSON.stringify(object[property], null, 2));
  }, interval);
}

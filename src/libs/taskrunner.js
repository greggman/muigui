import { removeArrayElem } from './utils.js';

const tasks = [];
const tasksToRemove = new Set();

let requestId;
let processing;

function removeTasks() {
  if (!tasksToRemove.size) {
    return;
  }

  if (processing) {
    queueProcessing();
    return;
  }

  tasksToRemove.forEach(task => {
    removeArrayElem(tasks, task);
  });
  tasksToRemove.clear();
}

function processTasks() {
  requestId = undefined;
  processing = true;
  for (const task of tasks) {
    if (!tasksToRemove.has(task)) {
      task();
    }
  }
  processing = false;
  removeTasks();
  queueProcessing();
}

function queueProcessing() {
  if (!requestId && tasks.length) {
    requestId = requestAnimationFrame(processTasks);
  }
}

export function addTask(fn) {
  tasks.push(fn);
  queueProcessing();
}

export function removeTask(fn) {
  tasksToRemove.set(fn);

  const ndx = tasks.indexOf(fn);
  if (ndx >= 0) {
    tasks.splice(ndx, 1);
  }
}
export const nextTick = (() => {
  if (typeof setImmediate === 'function') {
    return task => {
      setImmediate(task);
    };
  }

  if (typeof process === 'object' && typeof process.nextTick === 'function') {
    return task => {
      process.nextTick(task);
    };
  }

  if (typeof MessageChannel === 'function') {
    // http://www.nonblocking.io/2011/06/windownexttick.html
    let channel = new MessageChannel();
    let head = {}, tail = head;

    channel.port1.onmessage = () => {
      head = head.next;
      let task = head.task;
      delete head.task;
      task();
    };

    return task => {
      tail = tail.next = { task: task };
      channel.port2.postMessage(0);
    };
  }

  return task => {
    setTimeout(task, 0);
  };
})();

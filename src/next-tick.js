const nextTick = (() => {
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
    const channel = new MessageChannel();
    let head = {};
    let tail = head;

    channel.port1.onmessage = () => {
      head = head.next;
      const task = head.task;
      delete head.task;
      task();
    };

    return task => {
      tail = tail.next = { task };
      channel.port2.postMessage(0);
    };
  }

  return task => {
    setTimeout(task, 0);
  };
})();

module.exports = nextTick;

const { isThenable } = require('./util');
const StopIteration = require('./stop-iteration');
const nextTick = require('./next-tick');

const MAX_DELAY = 1500;

module.exports = function iterate(it, interval = 0) {
  return new Promise((resolve, reject) => {
    let totalTime = 0;

    function doIterate() {
      const cycleStartTime = Date.now();
      let cycleEndTime;

      try {
        for (;;) {
          const [isStop, value] = it.next();

          if (isThenable(value)) {
            value.then(awaitedValue => {
              if (isStop) {
                resolve(awaitedValue);
              } else if (awaitedValue === StopIteration) {
                resolve();
              } else {
                doIterate();
              }
            }, reject);
            return;
          }

          if (isStop) {
            resolve(value);
            return;
          }
          if (value === StopIteration) {
            resolve();
            return;
          }

          if (interval > 0) {
            break;
          }

          const endTime = Date.now();
          cycleEndTime = endTime - cycleStartTime;
          totalTime += cycleEndTime;

          // Break the loop when the process is continued for more than 1s
          if (totalTime > 1000) {
            break;
          }

          // Delay is not required for fast iteration
          if (cycleEndTime < 10) {
            continue;
          }
          break;
        }
      } catch (e) {
        reject(e);
        return;
      }

      if (interval > 0) {
        // Short timeouts will throttled to >=4ms by the browser, so we execute tasks
        // slowly enough to reduce CPU load
        const delay =  Math.min(MAX_DELAY, Date.now() - cycleStartTime + interval);
        setTimeout(doIterate, delay);
      } else {
        // Add delay corresponding to the processing speed
        const delay = Math.min(MAX_DELAY, cycleEndTime / 3);
        totalTime = 0;

        if (delay > 10) {
          setTimeout(doIterate, delay);
        } else {
          nextTick(doIterate);
        }
      }
    }

    // The first call doesn't need to wait, so it will execute a task immediately
    nextTick(doIterate);
  });
};

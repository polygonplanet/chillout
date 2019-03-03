import { isThenable } from './util';
import StopIteration from './stop-iteration';
import nextTick from './next-tick';

export default function iterate(it, interval = 0) {
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

          if (totalTime > 1000) {
            // Break the loop when the process is continued for more than 1s
            break;
          }
          if (cycleEndTime < 10) {
            // Delay is not required for fast iteration
            continue;
          }

          const risk = Math.min(10, Math.floor(cycleEndTime / 10));
          const margin = endTime % (10 - risk);
          if (!margin) {
            // Break the loop if processing has exceeded the allowable
            break;
          }
        }
      } catch (e) {
        reject(e);
        return;
      }

      if (interval > 0) {
        // Short timeouts will throttled to >=4ms by the browser, so we execute tasks
        // slowly enough to reduce CPU load
        const delay =  Math.min(1000, Date.now() - cycleStartTime + interval);
        setTimeout(doIterate, delay);
      } else {
        // Add delay corresponding to the processing speed
        const time = Math.sqrt(cycleEndTime) * Math.min(1000, cycleEndTime) / 80;
        const delay = Math.min(1000, Math.floor(time));
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
}

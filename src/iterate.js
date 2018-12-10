import nextTick from './next-tick';
import { isThenable } from './util';
import { STOP_ITERATION } from './iterator';

export default function iterate(it) {
  return new Promise((resolve, reject) => {
    let totalTime = 0;

    function doIterate() {
      const cycleStartTime = Date.now();
      let cycleEndTime;

      try {
        for (;;) {
          const [iterationResult, res] = it.next();

          if (isThenable(res)) {
            res.then(awaitedResult => {
              if (iterationResult === STOP_ITERATION || awaitedResult === false) {
                resolve();
              } else {
                doIterate();
              }
            }, err => {
              reject(err);
            });
            return;
          }

          if (iterationResult === STOP_ITERATION || res === false) {
            resolve();
            return;
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

    nextTick(doIterate);
  });
}

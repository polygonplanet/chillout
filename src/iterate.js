import nextTick from './nexttick';
import { isThenable } from './util';

export default function iterate(it) {
  return new Promise((resolve, reject) => {
    let totalTime = 0;

    function then(value) {
      value.then(res => {
        if (res === false) {
          resolve();
        } else {
          _iterate();
        }
      }, err => {
        reject(err);
      });
    }

    function _iterate() {
      const cycleStartTime = Date.now();
      let cycleEndTime;

      try {
        for (;;) {
          const res = it.next();
          if (res === false) {
            resolve();
            return;
          }

          if (isThenable(res)) {
            then(res);
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
        setTimeout(_iterate, delay);
      } else {
        nextTick(_iterate);
      }
    }

    nextTick(_iterate);
  });
}

import { types as t, flow } from 'mobx-state-tree';
import { wait, deferrable, IDeferrable } from 'promist';
import alerts from './alerts';

const values = {
  calls: 1
};

export default t
  .model({
    calls: t.number
  })
  .views((self) => ({
    get isLoading() {
      return self.calls !== 0;
    }
  }))
  .actions((self) => {
    let promise: Promise<void> & IDeferrable;
    const reset = (): void => {
      promise && promise.reject(Error(`Reset promise`));
      promise = deferrable(wait(20000));
    };
    return {
      starts: flow(function*() {
        self.calls += 1;
        try {
          reset();
          self.calls = yield promise.then(() => 0);
          alerts.addNotification('Loading is taking too long...');
        } catch (_) {}
      }),
      ends() {
        self.calls = Math.max(self.calls - 1, 0);
        if (self.calls === 0) {
          promise && promise.reject(Error('No loading to end'));
        }
      }
    };
  })
  .create(values);

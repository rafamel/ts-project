import { types as t, getRoot, flow } from 'mobx-state-tree';
import { wait, deferrable } from 'promist';

const declare = {
  schema: {
    calls: t.number
  },
  values: {
    calls: 1
  },
  views: (self) => ({
    get isLoading() {
      return self.calls !== 0;
    }
  }),
  actions: (self) => {
    let promise;
    const reset = () => {
      promise && promise.reject();
      promise = deferrable(wait(20000));
    };

    return {
      starts: flow(function*() {
        self.calls += 1;
        try {
          reset();
          self.calls = yield promise.then(() => 0);
          getRoot(self).alerts.addNotification('Loading is taking too long...');
        } catch (_) {}
      }),
      ends() {
        self.calls = Math.max(self.calls - 1, 0);
        if (self.calls === 0) promise && promise.reject();
      }
    };
  }
};

export default {
  values: declare.values,
  model: t
    .model(declare.schema)
    .actions(declare.actions)
    .views(declare.views)
};

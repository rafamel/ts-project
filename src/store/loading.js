import { types as t, getParent, flow } from 'mobx-state-tree';
import { getters } from './utils';
import { ResetableTimeout } from '@commons/lib/promisables';

const timeout = new ResetableTimeout();
const declare = {
  schema: {
    calls: t.number
  },
  values: {
    calls: 1
  },
  views: getters((self) => ({
    isLoading: () => self.calls !== 0
  })),
  actions: (self) => ({
    starts: flow(function*() {
      self.calls += 1;
      try {
        self.calls = yield timeout.reset(20000).then(() => 0);
        getParent(self).alerts.addNotification('Loading is taking too long...');
      } catch (_) {}
    }),
    ends() {
      self.calls = Math.max(self.calls - 1, 0);
      if (self.calls === 0) timeout.cancel();
    }
  })
};

export default {
  values: declare.values,
  model: t
    .model(declare.schema)
    .actions(declare.actions)
    .views(declare.views)
};

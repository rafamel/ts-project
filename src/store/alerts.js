import { types as t } from 'mobx-state-tree';
import { getters } from './utils';

const declare = {
  schema: {
    errorQueue: t.array(t.string),
    warningQueue: t.array(t.string),
    notificationQueue: t.array(t.string)
  },
  values: {
    errorQueue: [],
    warningQueue: [],
    notificationQueue: []
  },
  views: getters((self) => ({
    error: () => (self.errorQueue.length ? self.errorQueue[0] : ''),
    warning: () => (self.warningQueue.length ? self.warningQueue[0] : ''),
    notification: () =>
      self.notificationQueue.length ? self.notificationQueue[0] : ''
  })),
  actions: (self) => ({
    addError: (msg) => self.errorQueue.push(msg),
    removeError: () => self.errorQueue.shift(),
    addWarning: (msg) => self.warningQueue.push(msg),
    removeWarning: () => self.warningQueue.shift(),
    addNotification: (msg) => self.notificationQueue.push(msg),
    removeNotification: () => self.notificationQueue.shift()
  })
};

export default {
  values: declare.values,
  model: t
    .model(declare.schema)
    .actions(declare.actions)
    .views(declare.views)
};

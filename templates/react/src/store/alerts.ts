import { types as t } from 'mobx-state-tree';

const values = {
  errorQueue: [],
  warningQueue: [],
  notificationQueue: []
};

export default t
  .model({
    errorQueue: t.array(t.string),
    warningQueue: t.array(t.string),
    notificationQueue: t.array(t.string)
  })
  .views((self) => ({
    get error() {
      return self.errorQueue.length ? self.errorQueue[0] : '';
    },
    get warning() {
      return self.warningQueue.length ? self.warningQueue[0] : '';
    },
    get notification() {
      return self.notificationQueue.length ? self.notificationQueue[0] : '';
    }
  }))
  .actions((self) => ({
    addError: (msg: string) => self.errorQueue.push(msg),
    removeError: () => self.errorQueue.shift(),
    addWarning: (msg: string) => self.warningQueue.push(msg),
    removeWarning: () => self.warningQueue.shift(),
    addNotification: (msg: string) => self.notificationQueue.push(msg),
    removeNotification: () => self.notificationQueue.shift()
  }))
  .create(values);

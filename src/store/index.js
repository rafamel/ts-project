import { types as t } from 'mobx-state-tree';
import { getters } from './utils';
import loading from './loading';
import alerts from './alerts';

const store = {
  schema: {
    loading: loading.model,
    alerts: alerts.model
  },
  defaults: {
    loading: loading.values,
    alerts: alerts.values
  },
  views: getters((self) => ({})),
  actions: (self) => ({})
};

export default t
  .model(store.schema)
  .actions(store.actions)
  .views(store.views)
  .create(store.defaults);

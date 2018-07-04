import store from './store';
import theme from './theme';

// Reflect changes on the 'ignore' key for the 'react/prop-types'
// rule of eslint (.eslintrc.js)
export default {
  root: { store, theme }
};

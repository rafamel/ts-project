import { test } from '@jest/globals';
import assert from 'assert';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import Page from '../../src/pages/index';

test('renders without crashing (1)', () => {
  assert.doesNotThrow(() => render(<Page />));
});

test('renders without crashing (2)', () => {
  const div = document.createElement('div');
  assert.doesNotThrow(() => ReactDOM.render(<Page />, div));
  ReactDOM.unmountComponentAtNode(div);
});

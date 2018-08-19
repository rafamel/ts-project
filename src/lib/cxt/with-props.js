import React from 'react';

export default function withProps(a, b) {
  let obj = a;
  if (typeof a === 'string') obj = { [a]: b };

  const fixed = {};
  const computed = {};
  let usesContext = false;

  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const fn = obj[key];
    if (typeof fn !== 'function') fixed[key] = fn;
    else {
      if (fn.length > 1) usesContext = true;
      computed[key] = fn;
    }
  }

  const computedKeys = Object.keys(computed);
  function runFns(...args) {
    const result = {};
    for (let i = 0; i < computedKeys.length; i++) {
      const key = computedKeys[i];
      result[key] = computed[key](...args);
    }
    return result;
  }

  return (Component) => {
    /* eslint-disable react/display-name */
    const WithProps = !usesContext
      ? (props) => <Component {...props} {...fixed} {...runFns(props)} />
      : (props, context) => (
          <Component {...props} {...fixed} {...runFns(props, context)} />
        );
    /* eslint-enable react/display-name */
    WithProps.displayName = Component.name
      ? `WithProps${Component.name})`
      : `WithProps`;
    return WithProps;
  };
}

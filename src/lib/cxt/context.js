import React, { createContext } from 'react';
import withProps from './with-props';

const { Provider, Consumer } = createContext();

Provider.displayName = `ContextProvider`;
Consumer.displayName = `ContextConsumer`;

function withContext(a, b) {
  return (Component) => {
    if (a) Component = withProps(a, b)(Component);
    // Just render the component with props
    const WithContext = (props) => {
      return (
        <Consumer>
          {(context) => <Component {...props} {...context} />}
        </Consumer>
      );
    };
    if (Component.name) {
      WithContext.displayName = `WithContext(${Component.name})`;
    }
    return WithContext;
  };
}

export { Provider, Consumer, withContext };

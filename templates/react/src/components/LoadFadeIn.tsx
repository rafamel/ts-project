import React, { useState, useEffect } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { Transition } from 'react-transition-group';
import { css, cx } from 'emotion';

// TODO: modularize
LoadFadeIn.propTypes = {
  children: PropTypes.element.isRequired,
  duration: PropTypes.number,
  delay: PropTypes.number,
  timeout: PropTypes.number,
  onLoad: PropTypes.func,
  className: PropTypes.string
};
LoadFadeIn.styles = {
  out: css`
    max-height: 100vh;
    opacity: 0;
    overflow: hidden;
  `,
  in: css`
    opacity: 1;
  `
};
export default function LoadFadeIn(
  props: InferProps<typeof LoadFadeIn.propTypes>
): JSX.Element {
  const {
    children,
    duration,
    delay,
    timeout,
    onLoad,
    className
  } = Object.assign(
    { duration: 400, delay: 250, timeout: 5000, onLoad: () => {} },
    props
  );
  const [inProp, setInProp] = useState(false);
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      if (document.readyState === 'complete' || Date.now() - start > timeout) {
        clearInterval(interval);
        setTimeout(() => {
          onLoad();
          setInProp(true);
        }, delay);
      }
    }, 75);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Transition in={inProp} timeout={duration}>
      {(_state) => (
        <div
          className={cx(
            inProp ? LoadFadeIn.styles.in : LoadFadeIn.styles.out,
            css({ transition: `opacity ${duration}ms ease-in-out` }),
            className
          )}
        >
          {children}
        </div>
      )}
    </Transition>
  );
}

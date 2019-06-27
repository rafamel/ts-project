import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Fade from '@material-ui/core/Fade';
import LinearProgress from '@material-ui/core/LinearProgress';
import { css, cx } from 'emotion';

LoadingBar.styles = {
  root: css`
    position: fixed;
    display: block;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    z-index: 999;
  `,
  progress: css`
    height: 3px;
  `
};
LoadingBar.propTypes = {
  active: PropTypes.bool,
  duration: PropTypes.number,
  className: PropTypes.string
};
export default function LoadingBar(
  props: InferProps<typeof LoadingBar.propTypes>
): JSX.Element {
  const { styles } = LoadingBar;
  const { active, duration, className } = Object.assign(
    { active: false, duration: 750 },
    props
  );

  return (
    <div className={cx(styles.root, className)}>
      <Fade in={active} timeout={duration}>
        <LinearProgress color="primary" className={styles.progress} />
      </Fade>
    </div>
  );
}

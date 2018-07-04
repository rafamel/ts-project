import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import Fade from '@commons/Fade';

const styles = {
  root: {
    position: 'fixed',
    display: 'block',
    left: 0,
    right: 0,
    zIndex: 9999,
    height: '2.5px'
  },
  bar: {
    height: '2.5px'
  }
};

const LoadingBar = ({ active }) => (
  <div css={styles.root}>
    <Fade in={active} timeout={750}>
      <LinearProgress color="primary" css={styles.bar} />
    </Fade>
  </div>
);
LoadingBar.propTypes = {
  active: PropTypes.bool
};
LoadingBar.defaultProps = {
  active: false
};

export default LoadingBar;

import React from 'react';
import PropTypes from 'prop-types';
import { withContext } from 'cxt';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = ({ theme }) => ({
  toolbar: {
    main: {
      textShadow: '1px 1px 1px rgba(0, 0, 0, 0.15)',
      padding: '0 20px 0 0',
      [theme.breakpoints.media('tablet')]: {
        paddingLeft: 20
      }
    },
    text: {
      paddingLeft: 2,
      [theme.breakpoints.media('tablet')]: {
        paddingLeft: 0
      }
    },
    title: {
      fontSize: 19,
      fontWeight: 500,
      display: 'block',
      marginBottom: 3
    },
    subtitle: {
      fontSize: 12,
      fontWeight: 400,
      display: 'block'
    }
  },
  menuButton: {
    [theme.breakpoints.media('tablet')]: {
      display: 'none'
    }
  }
});

const TopBar = ({ styles, handleToggle }) => {
  return (
    <AppBar position="static">
      <Toolbar css={styles.toolbar.main}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleToggle}
          css={styles.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <div css={styles.toolbar.text}>
          <span css={styles.toolbar.title}>React App</span>
          <span css={styles.toolbar.subtitle}>Awesome things</span>
        </div>
      </Toolbar>
    </AppBar>
  );
};
TopBar.propTypes = {
  styles: PropTypes.object.isRequired,
  handleToggle: PropTypes.func.isRequired
};

export default withContext({ styles })(TopBar);

import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { withContext } from 'cxt';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

const styles = ({ theme, width = 300 }) => ({
  drawer: {
    docked: {
      height: '100%'
    },
    paper: {
      height: '100%',
      minHeight: 'calc(100vh - 64px)',
      width: width,
      [theme.breakpoints.media('tablet')]: {
        position: 'relative'
      }
    }
  },
  appBar: {
    position: 'absolute',
    marginLeft: width,
    [theme.breakpoints.media('tablet')]: {
      width: `calc(100% - ${width}px)`
    }
  }
});

const ResponsiveDrawer = (props) => {
  const { styles, handleToggle, open, children } = props;
  const drawerClasses = {
    docked: css(styles.drawer.docked),
    paper: css(styles.drawer.paper)
  };

  return (
    <React.Fragment>
      <Hidden mdUp>
        <Drawer
          variant="temporary"
          anchor={'left'}
          open={open}
          onClose={handleToggle}
          classes={drawerClasses}
          ModalProps={{
            keepMounted: true
          }}
        >
          {children}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer variant="permanent" classes={drawerClasses} open>
          {children}
        </Drawer>
      </Hidden>
    </React.Fragment>
  );
};
ResponsiveDrawer.propTypes = {
  styles: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  width: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]).isRequired
};

export default withContext({ styles })(ResponsiveDrawer);

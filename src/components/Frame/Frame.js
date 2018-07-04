import React from 'react';
import PropTypes from 'prop-types';
import TopBar from './TopBar';
import ResponsiveDrawer from './ResponsiveDrawer';
import BoundsAware from '@commons/BoundsAware';

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'row'
  },
  content: {
    parent: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',
      flexGrow: 1,
      overflow: 'hidden'
    },
    child: {
      maxWidth: 1000,
      flexGrow: 1
    }
  }
};

class Frame extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ]).isRequired,
    contentSizeChange: PropTypes.func
  };
  state = {
    open: false
  };
  handleToggle = () => {
    this.setState((state) => ({ open: !state.open }));
  };
  render() {
    const { children: allChildren, contentSizeChange } = this.props;
    const [firstChild, ...children] = allChildren;
    const content = <div css={styles.content.child}>{children}</div>;
    return (
      <React.Fragment>
        <TopBar handleToggle={this.handleToggle} />
        <div css={styles.main}>
          <ResponsiveDrawer
            open={this.state.open}
            handleToggle={this.handleToggle}
          >
            {firstChild}
          </ResponsiveDrawer>
          {contentSizeChange ? (
            <BoundsAware
              onSizeChange={contentSizeChange}
              css={styles.content.parent}
            >
              {content}
            </BoundsAware>
          ) : (
            <div css={styles.content.parent}>{content}</div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Frame;

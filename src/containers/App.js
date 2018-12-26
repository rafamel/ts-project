import React from 'react';
import { Global } from '@emotion/core';
import { withContext, compose } from 'cxt';
import { observer } from 'mobx-react';
import JSSProvider from '~/components/JSSProvider';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { HashRouter as Router } from 'react-router-dom';
import LoadingBar from '~/components/LoadingBar';
import Frame from '~/components/Frame';
import Pages from './Pages';
import LoadFadeIn from '@commons/LoadFadeIn';

const styles = ({ theme }) => ({
  global: {
    body: {
      fontFamily: theme.typography.fontFamily,
      backgroundColor: '#fafafa',
      userSelect: 'none',
      margin: 0,
      '@media print': { backgroundColor: '#ffffff' }
    }
  }
});
const App = ({ store: { loading }, theme, styles }) => (
  <JSSProvider>
    <MuiThemeProvider theme={theme}>
      <React.Fragment>
        <Global styles={styles.global} />
        <LoadingBar active={loading.isLoading} />
        <LoadFadeIn timeout={10000} onLoad={loading.ends}>
          <Router>
            <Frame>
              <div>Sidebar Content</div>
              <Pages />
            </Frame>
          </Router>
        </LoadFadeIn>
      </React.Fragment>
    </MuiThemeProvider>
  </JSSProvider>
);

export default compose(
  withContext({ styles }),
  observer
)(App);

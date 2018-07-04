import React from 'react';
import { injectGlobal } from 'emotion';
import { withContext, compose } from 'cxt';
import { MuiThemeProvider } from '@material-ui/core';
import { HashRouter as Router } from 'react-router-dom';
import LoadingBar from '#/LoadingBar';
import Frame from '#/Frame';
import Pages from './Pages';
import { observer } from 'mobx-react';
import LoadFadeIn from '@commons/LoadFadeIn';
import JssMuiProvider from '@commons/JssMuiProvider';

const styles = ({ theme }) => {
  injectGlobal({
    body: {
      fontFamily: theme.typography.fontFamily,
      backgroundColor: '#fafafa',
      userSelect: 'none',
      margin: 0,
      '@media print': { backgroundColor: '#ffffff' }
    }
  });
};
const App = ({ store: { loading }, theme }) => (
  <JssMuiProvider>
    <MuiThemeProvider theme={theme}>
      <React.Fragment>
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
  </JssMuiProvider>
);

export default compose(
  withContext({ styles }),
  observer
)(App);

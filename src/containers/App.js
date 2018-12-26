import React from 'react';
import { Global } from '@emotion/core';
import { Provider } from 'cxt';
import { observer } from 'mobx-react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { HashRouter as Router } from 'react-router-dom';
import LoadFadeIn from '@commons/LoadFadeIn';
import JSSProvider from '~/components/JSSProvider';
import LoadingBar from '~/components/LoadingBar';
import Frame from '~/components/Frame';
import Pages from './Pages';
import contexts from '~/contexts';

const { store, theme } = contexts.root;
const styles = {
  global: {
    body: {
      fontFamily: theme.typography.fontFamily,
      backgroundColor: '#fafafa',
      userSelect: 'none',
      margin: 0,
      '@media print': { backgroundColor: '#ffffff' }
    }
  }
};
const App = () => (
  <Provider value={contexts.root}>
    <JSSProvider>
      <MuiThemeProvider theme={theme}>
        <React.Fragment>
          <Global styles={styles.global} />
          <LoadingBar active={store.loading.isLoading} />
          <LoadFadeIn timeout={10000} onLoad={store.loading.ends}>
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
  </Provider>
);

export default observer(App);

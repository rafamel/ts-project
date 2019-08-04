import React from 'react';
import TopBar from './segments/TopBar';
import Footer from '~/segments/Footer';
import Home from './pages/Home';
import { variable, mui } from './theme';
import { injectGlobal } from 'emotion';
import LoadFadeIn from './components/LoadFadeIn';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/styles';
import store from './store';
import LoadingBar from './components/LoadingBar';
import { useObserver } from 'mobx-react-lite';
import { Provider } from 'urql';
import graphql from './graphql';

injectGlobal({ ':root': variable.styles });

export default function App(): JSX.Element {
  return useObserver(() => (
    <Provider value={graphql}>
      <StylesProvider injectFirst>
        <MuiThemeProvider theme={mui}>
          <LoadingBar active={store.loading.isLoading} />
          <LoadFadeIn onLoad={store.loading.ends}>
            <>
              <TopBar />
              <Home />
              <Footer />
            </>
          </LoadFadeIn>
        </MuiThemeProvider>
      </StylesProvider>
    </Provider>
  ));
}

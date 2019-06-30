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
import { ContextualProvider } from './utils';
import { context } from './context';

injectGlobal({ ':root': variable.styles });

export default function App(): JSX.Element {
  return useObserver(() => (
    <StylesProvider injectFirst>
      <MuiThemeProvider theme={mui}>
        <ContextualProvider value={context}>
          <LoadingBar active={store.loading.isLoading} />
          <LoadFadeIn onLoad={store.loading.ends}>
            <>
              <TopBar />
              <Home />
              <Footer />
            </>
          </LoadFadeIn>
        </ContextualProvider>
      </MuiThemeProvider>
    </StylesProvider>
  ));
}

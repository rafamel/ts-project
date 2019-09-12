import React, { useState } from 'react';
import TopBar from './segments/TopBar';
import Footer from '~/segments/Footer';
import Home from './pages/Home';
import { variable, mui } from './theme';
import { injectGlobal } from 'emotion';
import LoadFadeIn from './components/LoadFadeIn';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/styles';
import LoadingBar from './components/LoadingBar';
import { useObserver } from 'mobx-react-lite';

injectGlobal({ ':root': variable.styles });

export default function App(): JSX.Element {
  const [ready, setReady] = useState(false);

  return useObserver(() => (
    <StylesProvider injectFirst>
      <MuiThemeProvider theme={mui}>
        <LoadingBar active={!ready} />
        <LoadFadeIn onLoad={() => setReady(true)}>
          <>
            <TopBar />
            <Home />
            <Footer />
          </>
        </LoadFadeIn>
      </MuiThemeProvider>
    </StylesProvider>
  ));
}

import React from 'react';
import Home from './pages/Home';
import { variable, mui } from './theme';
import { injectGlobal } from 'emotion';
import LoadFadeIn from './components/LoadFadeIn';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/styles';
import store from './store';
import LoadingBar from './components/LoadingBar';
import { HashRouter } from 'react-router-dom';
import Header from '~/segments/Header';
import Footer from '~/segments/Footer';
import { IonApp, IonContent } from '@ionic/react';
import { useObserver } from 'mobx-react-lite';

injectGlobal({ ':root': variable.styles });

export default function App(): JSX.Element {
  return useObserver(() => (
    <StylesProvider injectFirst>
      <MuiThemeProvider theme={mui}>
        <HashRouter>
          <LoadingBar active={store.loading.isLoading} />
          <LoadFadeIn onLoad={store.loading.ends}>
            <IonApp>
              <Header />
              <IonContent>
                <Home />
              </IonContent>
              <Footer />
            </IonApp>
          </LoadFadeIn>
        </HashRouter>
      </MuiThemeProvider>
    </StylesProvider>
  ));
}

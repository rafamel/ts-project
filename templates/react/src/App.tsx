import React from 'react';
import { variable, mui } from './theme';
import { injectGlobal } from 'emotion';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/styles';
import { observer } from 'mobx-react';

injectGlobal({ ':root': variable.styles });

export default observer(App);

function App(): JSX.Element {
  return (
    <StylesProvider injectFirst>
      <MuiThemeProvider theme={mui}>
        <div>React starter</div>
      </MuiThemeProvider>
    </StylesProvider>
  );
}

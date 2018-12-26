import { createMuiTheme } from '@material-ui/core/styles';
import cyan from '@material-ui/core/colors/cyan';
import grey from '@material-ui/core/colors/grey';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true, // TODO remove on material-ui 4
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      '-apple-system',
      'system-ui',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Helvetica',
      'Arial',
      'sans-serif'
    ].join(',')
  },
  breakpoints: {
    values: { xs: 0, sm: 768, md: 768, lg: 1024, xl: 1024 }
  },
  palette: {
    type: 'light',
    primary: {
      main: cyan[600],
      light: cyan[100],
      dark: cyan[800],
      contrastText: 'rgba(255,255,255,0.85)'
    },
    secondary: {
      main: grey[500]
    }
  }
});

/* Aliases */
// Breakpoints
Object.defineProperties(theme.breakpoints, {
  tablet: { get: () => theme.breakpoints.values.sm },
  desktop: { get: () => theme.breakpoints.values.lg },
  media: { value: (name) => `@media (min-width:${theme.breakpoints[name]}px)` }
});

export default theme;

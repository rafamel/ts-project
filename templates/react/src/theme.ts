import { createMuiTheme } from '@material-ui/core/styles';
import theming from 'variable-theming';
import fonts from 'google-fonts';
import { palette } from '~/utils';
import config from './config';

// Examples:
// 'Quicksand', 'Montserrat', 'Raleway', 'Questrial', 'Comfortaa',
// 'Work Sans', 'Maven Pro', 'Montserrat Alternates', 'Julius Sans One'
fonts.add({
  Quicksand: true,
  Montserrat: true
});

export const theme = {
  palette: palette({
    origin: {
      main: '#fafafa',
      dark: '#f5f5f5',
      contrast: 'rgba(49, 50, 52, 0.85)',
      accent: '#B2B2B2'
    },
    primary: {
      main: '#31d484',
      contrast: '#fafafa'
    },
    secondary: {
      main: 'rgba(49, 50, 52, 0.85)',
      light: '#B2B2B2',
      contrast: '#fafafa'
    },
    info: { main: '#2e2e2e', contrast: '#fafafa' },
    success: { main: '#31d484', contrast: 'rgba(255,255,255,0.85)' },
    warn: { main: '#fcdf75', contrast: '#2e2e2e' },
    error: { main: '#ed7178', contrast: '#ffffff' },
    disable: { main: '#B2B2B2', contrast: '#fafafa' }
  }),
  typography: {
    fontFamily: {
      primary: `Quicksand, "Helvetica Neue", Helvetica, Arial, sans-serif`,
      secondary: `"Montserrat", var(--typography-font-family-primary)`,
      tertiary: `var(--typography-font-family-primary)`
    },
    fontSize: '1rem',
    fontWeight: 'normal',
    lineHeight: 1.6,
    letterSpacing: '0.025em'
  },
  variable: {
    spacing: '0.25rem',
    radius: '0.25rem'
  }
};

export const variable = theming(theme as any);

export const mui = createMuiTheme({
  typography: { fontFamily: theme.typography.fontFamily.primary },
  breakpoints: { values: config.get('breakpoints') },
  palette: palette.mui(theme.palette)
});

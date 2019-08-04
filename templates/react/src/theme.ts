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
  Montserrat: true,
  'Julius Sans One': true
});

export const theme = {
  palette: palette({
    primary: { main: '#31d484', contrast: '#fafafa' },
    actions: { main: '#313234d9', tint: '#B2B2B2', contrast: '#fafafa' },
    info: { main: '#2e2e2e', contrast: '#fafafa' },
    success: { main: '#31d484', contrast: 'rgba(255,255,255,0.85)' },
    warn: { main: '#fcdf75', contrast: '#2e2e2e' },
    danger: { main: '#ed7178', contrast: '#ffffff' },
    disabled: { main: '#d9d9d9', contrast: '#929292' },
    dark: { main: '#222428', tint: '#383a3e', shade: '#1e2023' },
    light: { main: '#f9f9f9', contrast: '#313234d9', accent: '#B2B2B2' }
  }),
  typography: {
    fontFamily: {
      primary: `Quicksand, "Helvetica Neue", Helvetica, Arial, sans-serif`,
      secondary: `"Montserrat", var(--typography-font-family-primary)`,
      tertiary: `"Julius Sans One", var(--typography-font-family-secondary)`
    },
    fontSize: '1em',
    fontWeight: 'normal',
    lineHeight: 1.6,
    letterSpacing: '0.025em'
  },
  shadow: {
    xs: '0 1px 3px 0 #0000001a, 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    sm: '0 4px 6px -1px #0000001a, 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 10px 15px -3px #0000001a, 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px #0000001a, 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xl: '0 25px 50px -20px rgba(0, 0, 0, 0.6)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
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

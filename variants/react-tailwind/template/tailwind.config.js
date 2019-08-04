const defaults = require('tailwindcss/defaultConfig');
const breakpoints = require('./breakpoints');

module.exports = {
  theme: {
    colors: {
      transparent: 'transparent',
      primary: palette('primary'),
      actions: palette('actions'),
      info: palette('info'),
      success: palette('success'),
      warn: palette('warn'),
      danger: palette('danger'),
      disabled: palette('disabled'),
      dark: palette('dark'),
      light: palette('light')
    },
    fontFamily: {
      primary: 'var(--typography-font-family-primary)',
      secondary: 'var(--typography-font-family-secondary)',
      tertiary: 'var(--typography-font-family-tertiary)'
    },
    spacing: calc('--variable-spacing', {
      ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      ...{ 20: 20, 24: 24, 32: 32, 40: 40, 48: 48, 56: 56, 64: 64 }
    }),
    borderRadius: {
      full: '50%',
      ...calc('--variable-radius', {
        ...{ xs: 0.75, sm: 1, md: 1.5, lg: 3, xl: 6 }
      })
    },
    fontSize: calc('--typography-font-size', {
      ...{ xs: 0.75, sm: 0.875, md: 1, lg: 1.25, xl: 1.5 }
    }),
    lineHeight: calc('--typography-line-height', {
      ...{ xs: 0.75, sm: 1, md: 1.25, lg: 1.5, xl: 2 }
    }),
    letterSpacing: calc('--typography-letter-spacing', {
      ...{ xs: -0.25, sm: 1, md: 1.25, lg: 1.5, xl: 3 }
    }),
    screens: Object.entries(breakpoints).reduce(
      (acc, [key, value]) => Object.assign(acc, { [key]: value + 'px' }),
      {}
    )
  },
  variants: Object.entries(defaults.variants).reduce(
    (acc, [key, value]) =>
      Object.assign(acc, {
        [key]: value.concat('important')
      }),
    {}
  ),
  plugins: [
    ({ addVariant }) => {
      addVariant('important', ({ container }) => {
        container.walkRules((rule) => {
          rule.selector = `.\\!${rule.selector.slice(1)}`;
          rule.walkDecls((decl) => {
            decl.important = true;
          });
        });
      });
    }
  ]
};

function palette(name) {
  return {
    main: `var(--palette-${name}-main)`,
    tint: `var(--palette-${name}-tint)`,
    shade: `var(--palette-${name}-shade)`,
    contrast: `var(--palette-${name}-contrast)`,
    accent: `var(--palette-${name}-accent)`
  };
}

function calc(base, items) {
  return Object.entries(items).reduce(
    (acc, [key, n]) => {
      return Object.assign(acc, {
        [key]: `calc(var(${base}) * ${n})`
      });
    },
    { base: `var(${base})` }
  );
}

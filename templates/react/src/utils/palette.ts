import { IOfType } from '~/types';
import { readableColor, lighten, darken, parseToRgb } from 'polished';

export interface IPalette {
  main: string;
  contrast: string;
  tint: string;
  shade: string;
  accent: string;
}

export interface IExtendedPalette extends IPalette {
  mainRgb: string;
  contrastRgb: string;
}

export interface IMuiPalette {
  main: string;
  light: string;
  dark: string;
  contrastText: string;
}

export default function palette<T extends IOfType<Partial<IPalette>>>(
  define: T
): { [P in keyof T]: IExtendedPalette } {
  const entries = Object.entries(define);
  const response: { [P in keyof T]?: IExtendedPalette } = {};

  for (let [name, palette] of entries) {
    const main = palette.main || '#fafafa';
    const contrast =
      palette.contrast || readableColor(main, '#fafafa', '#2e2e2e');
    const mainRgb = parseToRgb(main);
    const contrastRgb = parseToRgb(contrast);

    response[name as keyof T] = {
      main,
      contrast,
      tint: palette.tint || lighten(0.2, main),
      shade: palette.shade || darken(0.1, main),
      accent:
        palette.accent ||
        readableColor(main, darken(0.1, contrast), lighten(0.2, contrast)),
      mainRgb: `${mainRgb.red}, ${mainRgb.green}, ${mainRgb.blue}`,
      contrastRgb: `${contrastRgb.red}, ${contrastRgb.green}, ${contrastRgb.blue}`
    };
  }

  return response as { [P in keyof T]: IExtendedPalette };
}

palette.mui = function muiPlatte<T extends IOfType<IPalette>>(
  palettes: T
): { [P in keyof T]: IMuiPalette } {
  const entries: Array<[keyof T, IPalette]> = Object.entries(palettes);
  const response: { [P in keyof T]?: IMuiPalette } = {};

  for (let [key, value] of entries) {
    response[key] = {
      main: value.main,
      light: value.tint,
      dark: value.shade,
      contrastText: value.contrast
    };
  }

  return response as { [P in keyof T]: IMuiPalette };
};

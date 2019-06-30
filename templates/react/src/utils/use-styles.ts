import { useMemo } from 'react';

export interface IStyle {
  [key: string]: string | IStyle;
}

export default function useStyles<
  P extends { [key: string]: any },
  S extends IStyle
>(getStyles: (properties: P) => S, properties?: P): S {
  return useMemo(
    () => getStyles(properties || ({} as P)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    properties ? Object.values(properties) : []
  );
}

declare module '@craco/craco/lib/features/webpack/style/style' {
  export type CracoConfig = Record<string, any>;
  export type WebpackConfig = Record<string, any>;
  export type CracoContext = Record<string, any>;

  export function overrideStyle(
    cracoConfig: CracoConfig,
    webpackConfig: WebpackConfig,
    context: CracoContext
  ): WebpackConfig;
}

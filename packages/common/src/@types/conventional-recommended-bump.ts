declare module 'conventional-recommended-bump' {
  interface IOptions {
    ignoreReverted?: boolean;
    preset?: string;
    config?: any;
    whatBump?: any[];
    tagPrefix?: string;
    lernaPackage?: string;
  }
  interface IRecommendation {
    reason: string;
    releaseType: string;
  }
  export default function bump(
    options: IOptions,
    fn: (err: Error, recommendation: IRecommendation) => void
  ): void;
}

declare module 'commitizen/dist/cli/git-cz' {
  interface IEnvironment {
    cliPath?: string;
    config?: {
      path?: string;
    };
  }
  export function bootstrap(environment?: IEnvironment, argv?: string[]): void;
}

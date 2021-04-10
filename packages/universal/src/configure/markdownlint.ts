import { Deep, Empty, Serial } from 'type-core';
import { shallow } from 'merge-strategies';
import { defaults } from '../defaults';

export interface ConfigureMarkdownlintParams {
  overrides?: Serial.Object;
}

export type ConfigureMarkdownlintOptions = ConfigureMarkdownlintParams;

export function hydrateConfigureMarkdownLint(
  options: ConfigureMarkdownlintOptions | Empty
): Deep.Required<ConfigureMarkdownlintOptions> {
  return shallow(
    { overrides: defaults.lintmd.overrides },
    options || undefined
  );
}

export function configureMarkdownlint(
  options: ConfigureMarkdownlintOptions
): Serial.Object {
  const opts = hydrateConfigureMarkdownLint(options);

  return shallow(
    {
      'ul-indent': { indent: 2 },
      'line-length': false,
      'no-inline-html': false,
      'fenced-code-language': false,
      'commands-show-output': false
    },
    opts.overrides
  );
}

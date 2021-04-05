import { Empty, Serial } from 'type-core';
import { shallow } from 'merge-strategies';
import { defaults } from '../defaults';

export interface ConfigureMarkdownlintParams {
  overrides?: Serial.Object;
}

export interface ConfigureMarkdownlintOptions {}

export function configureMarkdownlint(
  options: ConfigureMarkdownlintOptions | Empty
): Serial.Object {
  const opts = shallow(
    { overrides: defaults.lintmd.overrides },
    options || undefined
  );

  return shallow(
    {
      'ul-indent': { indent: 2 },
      'line-length': false,
      'no-inline-html': false,
      'fenced-code-language': false,
      'commands-show-output': false
    },
    opts.overrides || undefined
  );
}

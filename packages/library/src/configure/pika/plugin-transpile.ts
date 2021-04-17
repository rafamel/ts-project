import { Serial } from 'type-core';
import { capture } from 'errorish';
import { run } from 'kpo';
import path from 'path';
import { BuilderOptions } from '@pika/types';
import { getTypeScriptPath } from '@riseup/utils';
import { hydrateTranspile, transpile } from '@riseup/tooling';
import { hydrateBuild } from '../../tasks';

export function manifest(
  manifest: Serial.Object,
  { cwd, options: { options } }: BuilderOptions
): void {
  const opts = {
    ...hydrateBuild(options),
    ...hydrateTranspile(options)
  };

  const isTypeScript = Boolean(opts.types && getTypeScriptPath(cwd));
  let output = path.relative(opts.destination, opts.output);
  if (output[output.length - 1] !== '/') output += '/';

  manifest.main = output;
  if (isTypeScript) manifest.types = output;

  manifest.files = ((manifest.files || []) as string[])
    .concat(output)
    .filter((x, i, arr) => arr.indexOf(x) === i);
}

export async function build({
  cwd,
  options: { options, config }
}: BuilderOptions): Promise<void> {
  try {
    await run(transpile(options, config), { cwd });
  } catch (err) {
    throw capture(err);
  }
}

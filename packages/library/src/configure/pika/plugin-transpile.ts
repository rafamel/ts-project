import { BuilderOptions } from '@pika/types';
import { capture } from 'errorish';
import { Serial } from 'type-core';
import { run } from 'kpo';
import path from 'path';
import { getTypeScript } from '@riseup/utils';
import { transpile } from '@riseup/tooling';
import { defaults } from '../../defaults';

export function manifest(
  manifest: Serial.Object,
  { cwd, options: { options } }: BuilderOptions
): void {
  const output = (options && options.output) || defaults.transpile.output;
  const isTypeScript = Boolean(options.types && getTypeScript(cwd));

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
  const output = (options && options.output) || defaults.transpile.output;
  const destination =
    (options && options.destination) || defaults.build.destination;

  try {
    await run(
      transpile(
        { ...options, output: path.join(destination, output) },
        { ...config }
      ),
      { cwd }
    );
  } catch (err) {
    throw capture(err);
  }
}

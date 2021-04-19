import { Serial } from 'type-core';
import { shallow } from 'merge-strategies';
import { BuilderOptions } from '@pika/types';
import { hydrateConfigurePika } from './index';

export function manifest(
  manifest: Serial.Object,
  { options }: BuilderOptions
): void {
  const opts = hydrateConfigurePika(options);

  if (opts.manifest) {
    Object.assign(manifest, shallow(manifest, opts.manifest || undefined));
  }
}

export const build = (): Promise<void> => Promise.resolve();

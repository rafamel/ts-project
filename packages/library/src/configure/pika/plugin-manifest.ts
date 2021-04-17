import { Serial } from 'type-core';
import { merge } from 'merge-strategies';
import { BuilderOptions } from '@pika/types';
import { hydrateConfigurePika } from './index';

export function manifest(
  manifest: Serial.Object,
  { options }: BuilderOptions
): void {
  const opts = hydrateConfigurePika(options);

  if (opts.nodev) manifest.devDependencies = {};
  if (opts.manifest) {
    Object.assign(manifest, merge(manifest, opts.manifest || undefined));
  }
}

export const build = (): Promise<void> => Promise.resolve();

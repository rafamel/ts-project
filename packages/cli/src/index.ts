import { loadPackage } from 'cli-belt';
import { cli as _cli } from 'kpo';

export async function cli(): Promise<void> {
  const pkg = await loadPackage(__dirname, { title: false });

  return _cli({
    bin: 'riseup',
    file: 'riseup.config.js',
    version: pkg.version || 'Unknown',
    description: pkg.description || '',
    multitask: true
  });
}

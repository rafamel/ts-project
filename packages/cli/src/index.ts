import { loadPackage } from 'cli-belt';
import { bin } from 'kpo';

export async function cli(): Promise<void> {
  const pkg = await loadPackage(__dirname, { title: false });

  return bin({
    bin: 'riseup',
    file: 'riseup.config.js',
    description: pkg.description || '',
    version: pkg.version || 'Unknown'
  });
}

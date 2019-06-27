export function getRoot(options: { paths?: { root?: string } }): string {
  return (options.paths && options.paths.root) || process.cwd();
}

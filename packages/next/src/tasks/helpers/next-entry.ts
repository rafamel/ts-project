import { addHook } from 'pirates';
import { paths } from '../../paths';

addHook(
  (_code, _filename) => {
    return `exports.writeAppTypeDeclarations = () => Promise.resolve();`;
  },
  {
    exts: ['.js'],
    ignoreNodeModules: false,
    matcher: (filename) => {
      return (
        filename.includes('next') &&
        filename.endsWith('writeAppTypeDeclarations.js')
      );
    }
  }
);

require(paths.bin.next);

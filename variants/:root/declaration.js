module.exports = {
  pipe: {
    'package.json': (pkg) => ({
      ...pkg,
      devDependencies: {
        ...pkg.devDependencies,
        husky: '^3.0.0',
        coveralls: '^3.0.4'
      },
      husky: {
        hooks: {
          'pre-commit': 'kpo precommit'
        }
      }
    })
  }
};

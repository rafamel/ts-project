module.exports = {
  pipe: {
    'package.json': (pkg) => ({
      ...pkg,
      devDependencies: {
        ...pkg.devDependencies,
        husky: '^2.4.1',
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

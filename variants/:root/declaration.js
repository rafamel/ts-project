module.exports = {
  pipe: {
    'package.json': (pkg) => ({
      ...pkg,
      devDependencies: {
        ...pkg.devDependencies,
        husky: '^3.0.9',
        coveralls: '^3.0.7'
      },
      husky: {
        hooks: {
          'pre-commit': 'kpo verify'
        }
      }
    })
  }
};

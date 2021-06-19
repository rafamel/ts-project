# next-template

<!-- [![Version](https://img.shields.io/npm/v/next-template.svg)](https://www.npmjs.com/package/next-template)
[![Build Status](https://img.shields.io/travis/rafamel/next-template/master.svg)](https://travis-ci.org/rafamel/next-template)
[![Coverage](https://img.shields.io/coveralls/rafamel/next-template/master.svg)](https://coveralls.io/github/rafamel/next-template)
[![Dependencies](https://img.shields.io/david/rafamel/next-template.svg)](https://david-dm.org/rafamel/next-template)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/next-template.svg)](https://snyk.io/test/npm/next-template)
[![License](https://img.shields.io/github/license/rafamel/next-template.svg)](https://github.com/rafamel/next-template/blob/master/LICENSE)
[![Types](https://img.shields.io/npm/types/next-template.svg)](https://www.npmjs.com/package/next-template)

> Riseup next template.

## Install

[`npm install next-template`](https://www.npmjs.com/package/next-template) -->

## Features

- Transpiling: [Babel](https://babeljs.io/), [TypeScript](https://en.wikipedia.org/wiki/TypeScript)
- Tests: [Jest](https://jestjs.io/)
- Linting: [ESLint](https://github.com/eslint/eslint), [Prettier](https://github.com/prettier/prettier), [`markdownlint-cli`](https://github.com/igorshubovych/markdownlint-cli)
- Tasks: [`kpo`](https://github.com/rafamel/kpo)
- Commits: [`commitizen`](https://github.com/commitizen/cz-cli)
- Docs: [TypeDoc](https://github.com/TypeStrong/typedoc/)

## Limitations

- **TypeScript:**
  - Even though _TypeScript_ files are transpiled with _Babel,_ you should keep in mind they are still type-checked and linted in accordance to the _TypeScript_ specification, which means that custom babel transforms that conflict with it might produce errors.
  - As _TypeScript_ is transpiled with _Babel,_ [there are a couple things to keep in mind regarding `namespace`, `const enum` and `export =` / `import =` usage.](https://babeljs.io/docs/en/babel-plugin-transform-typescript)

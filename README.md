# React Boilerplate

<!-- [![Build Status](https://img.shields.io/travis/rafamel/ts-react/master.svg)](https://travis-ci.org/rafamel/ts-react)
[![Coverage](https://img.shields.io/coveralls/rafamel/ts-react/master.svg)](https://coveralls.io/github/rafamel/ts-react)
[![Dependencies](https://img.shields.io/david/rafamel/ts-react.svg)](https://david-dm.org/rafamel/ts-react)
[![License](https://img.shields.io/github/license/rafamel/ts-react.svg)](https://github.com/rafamel/ts-react/blob/master/LICENSE) -->

> A bells & whistles React boilerplate with TypeScript support.

If you find it useful, consider [starring the project](https://github.com/rafamel/ts-react) 💪 and/or following [its author](https://github.com/rafamel) ❤️ -there's more on the way!

## Stack

* Store: *MobX* & *MST*
* Styles: *Emotion 10*
* Design: *Material UI*
* Logs: *loglevel*

### More greatness

* Service Worker (PWA ready)
* Contextual theming and store

## Features

* Bundling: [Webpack 4](https://webpack.js.org/)
* Transpiling: [Babel 7](https://babeljs.io/), [TypeScript 3](https://en.wikipedia.org/wiki/TypeScript)
* Tests: [Jest](https://jestjs.io/), [Enzyme](https://airbnb.io/enzyme/)
* Linting: [ESLint](https://github.com/eslint/eslint), [Prettier](https://github.com/prettier/prettier), [`markdownlint-cli`](https://github.com/igorshubovych/markdownlint-cli)
* Tasks: [`kpo`](https://github.com/rafamel/kpo), [`onchange`](https://github.com/Qard/onchange)
* Commits: [`commitizen`](https://github.com/commitizen/cz-cli), [`husky`](https://github.com/typicode/husky)
* Docs: [`conventional-changelog`](https://github.com/conventional-changelog)
* Opt-in CI: [TravisCI](https://travis-ci.org/), [Coveralls](https://coveralls.io/), and minimal noise configuration for [Renovate](https://renovatebot.com/)

## Limitations

* **TypeScript:**
  * Even though *TypeScript* files are transpiled with *Babel,* you should keep in mind they are still type-checked and linted in accordance to the *TypeScript* specification, which means that custom babel transforms that conflict with it might produce errors.
  * As *TypeScript* is transpiled with *Babel,* [there are a couple things to keep in mind regarding `namespace`, `const enum` and `export =` / `import =` usage.](https://babeljs.io/docs/en/babel-plugin-transform-typescript)

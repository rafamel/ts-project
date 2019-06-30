# library-starter

<!-- [![Version](https://img.shields.io/npm/v/library-starter.svg)](https://www.npmjs.com/package/library-starter)
[![Build Status](https://img.shields.io/travis/rafamel/library-starter/master.svg)](https://travis-ci.org/rafamel/library-starter)
[![Coverage](https://img.shields.io/coveralls/rafamel/library-starter/master.svg)](https://coveralls.io/github/rafamel/library-starter)
[![Dependencies](https://img.shields.io/david/rafamel/library-starter.svg)](https://david-dm.org/rafamel/library-starter)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/library-starter.svg)](https://snyk.io/test/npm/library-starter)
[![License](https://img.shields.io/github/license/rafamel/library-starter.svg)](https://github.com/rafamel/library-starter/blob/master/LICENSE)
[![Types](https://img.shields.io/npm/types/library-starter.svg)](https://www.npmjs.com/package/library-starter)

<div align="center">
  <br />
  <br />
  <a href="https://www.npmjs.com/package/library-starter" target="_blank">
    <img alt="library-starter" width="350" src="https://raw.githubusercontent.com/rafamel/library-starter/master/assets/logo.png" />
  </a>
  <br />
  <br />
  <strong>A bells & whistles riseup based library starter</strong>
  <br />
  <br />
</div>

> A bells & whistles riseup based library starter.

If you find it useful, consider [starring the project](https://github.com/rafamel/library-starter) 💪 and/or following [its author](https://github.com/rafamel) ❤️ -there's more on the way!

## Install

[`npm install library-starter`](https://www.npmjs.com/package/library-starter)

## Motivation / Use cases | Documentation | Usage / Examples -->

## Features

* Transpiling: [Babel 7](https://babeljs.io/), [TypeScript 3](https://en.wikipedia.org/wiki/TypeScript)
* Tests: [Jest](https://jestjs.io/)
* Linting: [ESLint](https://github.com/eslint/eslint), [Prettier](https://github.com/prettier/prettier), [`markdownlint-cli`](https://github.com/igorshubovych/markdownlint-cli)
* Tasks: [`kpo`](https://github.com/rafamel/kpo), [`onchange`](https://github.com/Qard/onchange)
* Commits: [`commitizen`](https://github.com/commitizen/cz-cli), [`husky`](https://github.com/typicode/husky)
* Docs: [TypeDoc](https://github.com/TypeStrong/typedoc/), [`conventional-changelog`](https://github.com/conventional-changelog)
* Opt-in CI: [TravisCI](https://travis-ci.org/), [Coveralls](https://coveralls.io/), and minimal noise configuration for [Renovate](https://renovatebot.com/)

## Usage

### Cloning and installing dependencies

* Clone the repo: `git clone https://github.com/rafamel/library-starter.git`
* Switch to the project directory: `cd library-starter`
* Run first install: `npm install`
* Remove the starter's git folder and then initialize git: `npm run clean && git init`.

### Adjusting to your project

* Modify your project info (name, description, keywords, author, repo...) @ `package.json`.
* Modify `LICENSE` & `README.md`
* Project config @ `project.config.js`
* Tasks @ `kpo.scripts.js`

### Running tasks

* Development build & watch: `npm start`
* Tests: `npm t`
* Watch tests: `npm run test.watch`
* Fix formatting: `npm run fix`
* Validate project (types, lint, format, spelling...): `npm run validate`
* Production build: `npm run build`
* Increase version: `npm run semantic -- [<newversion> | major | minor | patch]`
* Publish: `npm run release`
* Update dependencies: `npm run update`
* Clean project (`node_modules`, `coverage`...): `npm run clean`
* Commit: `npm run commit`

## Limitations

* **TypeScript:**
  * Even though *TypeScript* files are transpiled with *Babel,* you should keep in mind they are still type-checked and linted in accordance to the *TypeScript* specification, which means that custom babel transforms that conflict with it might produce errors.
  * As *TypeScript* is transpiled with *Babel,* [there are a couple things to keep in mind regarding `namespace`, `const enum` and `export =` / `import =` usage.](https://babeljs.io/docs/en/babel-plugin-transform-typescript)

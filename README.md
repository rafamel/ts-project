# TS Project

<!-- [![Version](https://img.shields.io/npm/v/ts-project.svg)](https://www.npmjs.com/package/ts-project)
[![Build Status](https://img.shields.io/travis/rafamel/ts-project.svg)](https://travis-ci.org/rafamel/ts-project)
[![Coverage](https://img.shields.io/coveralls/rafamel/ts-project.svg)](https://coveralls.io/github/rafamel/ts-project)
[![Dependencies](https://img.shields.io/david/rafamel/ts-project.svg)](https://david-dm.org/rafamel/ts-project)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/ts-project.svg)](https://snyk.io/test/npm/ts-project)
[![License](https://img.shields.io/github/license/rafamel/ts-project.svg)](https://github.com/rafamel/ts-project/blob/master/LICENSE)
[![Types](https://img.shields.io/npm/types/ts-project.svg)](https://www.npmjs.com/package/ts-project) -->

<!-- <div align="center">
  <br />
  <br />
  <a href="https://www.npmjs.com/package/ts-project" target="_blank">
    <img alt="ts-project" width="350" src="https://raw.githubusercontent.com/rafamel/ts-project/master/assets/logo.png" />
  </a>
  <br />
  <br />
  <strong>A bells & whistles setup for any TS/JS project</strong>
  <br />
  <br />
</div> -->

> A bells & whistles setup for any TypeScript project.

If you find it useful, consider [starring the project](https://github.com/rafamel/ts-project) 💪 and/or following [its author](https://github.com/rafamel) ❤️ -there's more on the way!

<!-- ## Install

[`npm install ts-project`](https://www.npmjs.com/package/ts-project) 

## Motivation / Use cases | Documentation | Usage / Examples -->

## Features

* Transpiling & types: [Babel 7](https://babeljs.io/), [TypeScript 3](https://en.wikipedia.org/wiki/TypeScript), [@pika/pack](https://github.com/pikapkg/pack)
* Tests: [Jest](https://jestjs.io/)
* Linting & format: [ESLint](https://github.com/eslint/eslint), [Prettier](https://github.com/prettier/prettier), [`markdownlint-cli`](https://github.com/igorshubovych/markdownlint-cli)
* Cross-platform support: [`cross-env`](https://github.com/kentcdodds/cross-env), [`shx`](https://github.com/shelljs/shx)
* Tasks, scripts: [`kpo`](https://github.com/rafamel/kpo), [`onchange`](https://github.com/Qard/onchange)
* Commits & hooks: [`commitizen`](https://github.com/commitizen/cz-cli), [`husky`](https://github.com/typicode/husky)
* Docs generation: [TypeDoc](https://github.com/TypeStrong/typedoc/), [`conventional-changelog`](https://github.com/conventional-changelog)
* Opt-in CI: [TravisCI](https://travis-ci.org/), [Coveralls](https://coveralls.io/), and minimal noise configuration for [Renovate](https://renovatebot.com/)

## Usage

### Cloning and installing dependencies

* Clone the repo: `git clone https://github.com/rafamel/ts-project.git`
* Switch to the project directory: `cd ts-project`
* Remove boilerplate git folder, then initialize git: `npx shx rm -rf .git && git init`.
* Run first install: `npm install`

### Adjusting to your project

* Modify your project info (name, description, keywords, author, repo...) @ `package.json`.
* Modify `LICENSE` & `README.md`
* Project config @ `project.config.js`
* Tasks @ `package-scripts.js`

### Running tasks

* Development build & watch: `npm start`
* Tests: `npm t`
* Watch tests: `npm run test:watch`
* Fix formatting and interactive spellcheck: `npm run fix`
* Validate project (types, lint, format, spelling...): `npm run validate`
* Production build: `npm run build`
* Increase version: `npm version [<newversion> | major | minor | patch]`
* Publish: `npm run publish`
* Update dependencies: `npm run update`
* Clean project (`node_modules`, `coverage`...): `npm run clean`
* Commit: `npm run commit`

## Limitations

* **TypeScript:**
  * Even though *TypeScript* files are transpiled with *Babel,* you should keep in mind they are still type-checked and linted in accordance to the *TypeScript* specification, which means that custom babel transforms that conflict with it might produce errors.
  * As *TypeScript* is transpiled with *Babel,* [there are a couple things to keep in mind regarding `namespace`, `const enum` and `export =` / `import =` usage.](https://babeljs.io/docs/en/babel-plugin-transform-typescript)

## Known issues

* **Git hooks on Windows:** There's currently an issue with [`husky`'s](https://github.com/typicode/husky) `stdin` support on Windows. As interactivity on hooks was only available on `husky@1.3.0`, that version is locked on `package.json`. However, if [you experience hooks hanging on Windows](https://github.com/typicode/husky/issues/431), you should update husky's version to disable `stdin` support [until another solution is available.](https://github.com/typicode/husky/issues/442)

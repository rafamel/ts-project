# TS/JS Project

<!-- [![Version](https://img.shields.io/npm/v/ts-project.svg)](https://www.npmjs.com/package/ts-project)
[![Build Status](https://travis-ci.org/rafamel/ts-project.svg)](https://travis-ci.org/rafamel/ts-project)
[![Coverage](https://img.shields.io/coveralls/rafamel/ts-project.svg)](https://coveralls.io/github/rafamel/ts-project)
[![Dependencies](https://david-dm.org/rafamel/ts-project/status.svg)](https://david-dm.org/rafamel/ts-project)
[![Vulnerabilities](https://snyk.io/test/npm/ts-project/badge.svg)](https://snyk.io/test/npm/ts-project)
[![Issues](https://img.shields.io/github/issues/rafamel/ts-project.svg)](https://github.com/rafamel/ts-project/issues)
[![License](https://img.shields.io/github/license/rafamel/ts-project.svg)](https://github.com/rafamel/ts-project/blob/master/LICENSE) -->

<!-- markdownlint-disable MD036 -->
**A bells & whistles setup for any TS/JS project.**
<!-- markdownlint-enable MD036 -->

<!-- ## Install

 [`npm install ts-project`](https://www.npmjs.com/package/ts-project) -->

## Features

* Transpiling & types: [Babel 7](https://babeljs.io/), [TypeScript 3](https://en.wikipedia.org/wiki/TypeScript)
* Tests: [Jest](https://jestjs.io/)
* Linting & format: [ESLint](https://github.com/eslint/eslint), [TSLint](https://github.com/palantir/tslint), [Prettier](https://github.com/prettier/prettier), [`markdownlint-cli`](https://github.com/igorshubovych/markdownlint-cli), [`markdown-spellcheck`](https://github.com/lukeapage/node-markdown-spellcheck)
* Cross-platform support: [`cross-env`](https://github.com/kentcdodds/cross-env), [`shx`](https://github.com/shelljs/shx)
* Tasks, scripts, & hooks: [Jake](https://github.com/jakejs/jake), [`nps`](https://github.com/kentcdodds/nps), [`concurrently`](https://github.com/kimmobrunfeldt/concurrently), [`onchange`](https://github.com/Qard/onchange), [`husky`](https://github.com/typicode/husky)
* Docs generation: [TypeDoc](https://github.com/TypeStrong/typedoc/)
* Opt-in CI: [TravisCI](https://travis-ci.org/) & [Coveralls](https://coveralls.io/)

## Usage

### Cloning and installing dependencies

* Clone the repo: `git clone https://github.com/rafamel/ts-project.git`
* Switch to the project directory: `cd ts-project`
* Remove boilerplate git folder and init git: `npx shx rm -rf .git && git init`.
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
* Increase version: `npm version [major|minor|patch]`
* Publish: `npm run publish`
* Update dependencies: `npm run update`
* Clean project (`node_modules`, `coverage`...): `npm run clean`

## Known issues

At this time, the [`babel-eslint`](https://github.com/babel/babel-eslint/) parser for ESLint [is pending](https://github.com/babel/babel-eslint/issues/505) [*TypeScript* support,](https://github.com/babel/babel-eslint/issues/663) which means you can either:

* not parse any *TypeScript* files with ESLint (check `package-scripts.js`),
* use [`typescript-eslint`](https://github.com/typescript-eslint/typescript-eslint) instead,
* or ignore problematic files on a case-by-case basis by defining them on a `.eslintignore` file.
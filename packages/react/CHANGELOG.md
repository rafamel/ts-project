# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.6.0](https://github.com/rafamel/riseup/compare/v0.5.0...v0.6.0) (2021-06-13)


### Bug Fixes

* **pacakges/react:** add React to globals on reconfigureAvaReact ([624bb10](https://github.com/rafamel/riseup/commit/624bb102b97f621f4646203d071987f353452f72))
* **packages:** does not use babel transform mappers for actual builds ([e373ec1](https://github.com/rafamel/riseup/commit/e373ec1a14cb4cd2d5c8d9795772f9c718fbfc01))
* **packages:** make react and tooling packages public ([9f26e2f](https://github.com/rafamel/riseup/commit/9f26e2f8e5f978444420531dba53b1810a8531f6))
* **packages:** update dependencies ([17e8b0b](https://github.com/rafamel/riseup/commit/17e8b0be83bb857e038b8298b5bd5e584c4f5bba))
* **packages:** update dependencies ([f520850](https://github.com/rafamel/riseup/commit/f520850d78b7889d3bf1b2020973430b6c914ccd))
* **packages/react:** add missing dependencies ([f804ce5](https://github.com/rafamel/riseup/commit/f804ce574ea9f4691352c076e04c9a1c8a4fd272))
* **packages/react:** add missing dependencies ([6014405](https://github.com/rafamel/riseup/commit/601440584a2374bd282e2e280591645cf30e0e5c))
* **packages/react:** fix ForkTsCheckerWebpackPlugin setup for craco ([e385a6b](https://github.com/rafamel/riseup/commit/e385a6b0ceb88d076d337a38a24d1efe158a5a30))
* **packages/react:** remove react preset from babel configuration for start and build tasks ([8e4cf91](https://github.com/rafamel/riseup/commit/8e4cf91cb127bad45a467650fee14f9f2e575fc7))


### Features

* **pacakges:** add context to reconfigure callbacks ([acf6383](https://github.com/rafamel/riseup/commit/acf638387cf02ac00d5d394d7da5933d48477779))
* **packages:** use jest for tests instead of ava ([77bbd4e](https://github.com/rafamel/riseup/commit/77bbd4e4df4d96109d6a4bd0cb6cd4b82cefc97e))
* **packages/react:** add analyze task ([af121e5](https://github.com/rafamel/riseup/commit/af121e5a71907acb22df61ff90d80fdffdace966))
* **packages/react:** add build task ([5e6ed5c](https://github.com/rafamel/riseup/commit/5e6ed5c256ec428ba00254e401114a30db7ed14c))
* **packages/react:** add main react set up function ([a520f1b](https://github.com/rafamel/riseup/commit/a520f1b69101ad3b532840099806effbc2e5298c))
* **packages/react:** add reconfigureAvaReact ([656df2e](https://github.com/rafamel/riseup/commit/656df2eb34983207a9314e6e9a6c58339e071f74))
* **packages/react:** add reconfigureBabelReact ([c899fcb](https://github.com/rafamel/riseup/commit/c899fcb8cda60d6c34ceb6e6855b67e819c74315))
* **packages/react:** add reconfigureEslintReact ([faffc1d](https://github.com/rafamel/riseup/commit/faffc1d8640ad08269681fa328f47dc1e56329e4))
* **packages/react:** add reconfigureWebpackStyles and reconfigureWebpackAddPlugins ([ba5ec8c](https://github.com/rafamel/riseup/commit/ba5ec8cb007a65a8b6ace497249de2abd87614fb))
* **packages/react:** add size task ([ab61ab2](https://github.com/rafamel/riseup/commit/ab61ab2cf1e213b42855328631a80debd8697d47))
* **packages/react:** add start task ([e004e0a](https://github.com/rafamel/riseup/commit/e004e0a57e2bcfd7d96bf2487a20c50e181eb7a5))
* **packages/react:** support images and styles in babel configuration ([b382102](https://github.com/rafamel/riseup/commit/b3821023ae3c66d5a4af7a4f34439457bdf9ca05))
* **packages/tooling:** allow for granular babel reconfiguration ([214dd5a](https://github.com/rafamel/riseup/commit/214dd5a19cc366625a08b35c9274c24550f17d52))
* **packages/tooling:** take global extensions for assets and styles to be mocked ([8c7cbc9](https://github.com/rafamel/riseup/commit/8c7cbc94fe2d84f183246c1d61c7a9d34d7d5445))
* **packages/tooling:** use different typescript include configurations per task ([4ad8341](https://github.com/rafamel/riseup/commit/4ad834189b3317a7ee4bce8ac1564fb37ad158c5))





# [0.5.0](https://github.com/rafamel/riseup/compare/v0.4.0...v0.5.0) (2019-11-01)


### Bug Fixes

* **deps:** updates dependencies ([23a20b5](https://github.com/rafamel/riseup/commit/23a20b597feea8e75c7c87e9e51f6863be075da5))


### Features

* sets engine as and transpiles for node 12 ([d14174d](https://github.com/rafamel/riseup/commit/d14174d9d1fc890cc4fb68c9bf04c3a84a38c2ed))





# [0.4.0](https://github.com/rafamel/riseup/compare/v0.3.0...v0.4.0) (2019-09-12)


### Bug Fixes

* **packages/react:** fixes analyze script ([0ee0c45](https://github.com/rafamel/riseup/commit/0ee0c45))





# [0.3.0](https://github.com/rafamel/riseup/compare/v0.2.0...v0.3.0) (2019-09-12)


### Bug Fixes

* **deps:** updates dependencies ([baba8f6](https://github.com/rafamel/riseup/commit/baba8f6))
* **packages:** updates dependencies ([ca2285b](https://github.com/rafamel/riseup/commit/ca2285b))
* **packages/react:** fixes jest for /test folder ([d1ea9e4](https://github.com/rafamel/riseup/commit/d1ea9e4))
* **packages/react:** resolves eslint plugins relative to tooling package ([943f87b](https://github.com/rafamel/riseup/commit/943f87b))
* **packages/react:** temporal fix for deprecated eslint-config-react-app rule ([dd666c5](https://github.com/rafamel/riseup/commit/dd666c5))
* **packages/react:** updates eslint-config-react-app peer dependency version ([903f5ce](https://github.com/rafamel/riseup/commit/903f5ce))


### Features

* **packages/react:** adds relevant tooling peer dependencies as dependencies ([d013112](https://github.com/rafamel/riseup/commit/d013112))





# [0.2.0](https://github.com/rafamel/riseup/compare/v0.1.0...v0.2.0) (2019-08-04)

**Note:** Version bump only for package @riseup/react





# [0.1.0](https://github.com/rafamel/riseup/compare/v0.0.2...v0.1.0) (2019-08-04)


### Bug Fixes

* **deps:** updates dependencies ([f06ef87](https://github.com/rafamel/riseup/commit/f06ef87))
* changes precommit script name to pre-commit to avoid husky double runs ([bc9b754](https://github.com/rafamel/riseup/commit/bc9b754))





## [0.0.2](https://github.com/rafamel/riseup/compare/v0.0.1...v0.0.2) (2019-07-02)


### Bug Fixes

* updates dependencies ([1a54aed](https://github.com/rafamel/riseup/commit/1a54aed))
* **packages/react:** fixes eslint presets typings ([6c6ff73](https://github.com/rafamel/riseup/commit/6c6ff73))

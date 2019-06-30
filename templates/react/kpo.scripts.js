const kpo = require('kpo');
const { scripts } = require('./project.config');

module.exports.scripts = {
  ...scripts,
  'deploy:caprover': [
    kpo.ensure`deploy`,
    kpo.line`tarjs -cvf ./deploy/deploy.tar --portable
      ./captain-definition ./build/*`,
    'caprover deploy -t ./deploy/deploy.tar'
  ]
};

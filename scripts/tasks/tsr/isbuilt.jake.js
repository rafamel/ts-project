const fs = require('fs');
const project = require('../../../project.config');

desc('Ensure project has been built.');
task('isbuilt', (cmd) => {
  const exists = fs.existsSync(project.get('paths.output'));
  if (exists) return;

  console.log("Project hasn't been built yet. Building...");
  jake.exec(cmd, { interactive: true });
});

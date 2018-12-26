const fs = require('fs');
const config = require('../../setup.config');

desc('Ensure project has been built.');
task('builtensure', (cmd) => {
  const exists = fs.existsSync(config.paths.output);
  if (exists) return;

  console.log("Project hasn't been built yet. Building...");
  jake.exec(cmd, { interactive: true });
});

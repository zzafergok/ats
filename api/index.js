const { exec } = require('child_process');
const path = require('path');

// Build the TypeScript project
exec('npm run build', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
  if (error) {
    console.error('Build error:', error);
    return;
  }
  console.log('Build completed:', stdout);
});

// Export the built app
module.exports = require('../dist/app.js');
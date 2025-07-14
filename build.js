const debug = require('debug')('homy:build');
const { globSync } = require('glob');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const base = __dirname;
const dest = path.join(__dirname, './dist/homy');

const patterns = [
  'app/**',
  'vendor/**',
  'node_modules/angular-bootstrap-colorpicker/**',
  'node_modules/jquery/dist/**',
  'node_modules/normalize.css/**',
  'node_modules/angular/angular.min.js',
  'node_modules/angular-ui-sortable/dist/**',
  'node_modules/jquery-ui/dist/**',
  'manifest.json',
  'LICENSE',
  'README.md'
];

console.log('Building extension...');

let totalFiles = 0;
let copiedFiles = 0;

patterns.forEach(pattern => {
  try {
    const files = globSync(pattern, { cwd: base });
    totalFiles += files.length;

    files.forEach(file => {
      const input = path.join(base, file);
      const output = path.join(dest, file);

      try {
        const stats = fs.statSync(input);
        if (stats.isDirectory()) {
          mkdirp.sync(output);
          return;
        }

        // Check if file needs copying
        let needsCopy = true;
        try {
          const outputStats = fs.statSync(output);
          if (outputStats.mtime.getTime() === stats.mtime.getTime()) {
            needsCopy = false;
          }
        } catch (e) {
          // File doesn't exist, needs copying
        }

        if (needsCopy) {
          mkdirp.sync(path.dirname(output));
          fs.copyFileSync(input, output);
          fs.utimesSync(output, stats.atime, stats.mtime);
          copiedFiles++;
          debug(`Copied: ${file}`);
        } else {
          debug(`Skipped (no changes): ${file}`);
        }
      } catch (e) {
        console.error(`Error processing ${file}:`, e.message);
      }
    });
  } catch (e) {
    console.error(`Error with pattern ${pattern}:`, e.message);
  }
});

console.log(`Build complete! Processed ${totalFiles} files, copied ${copiedFiles} files to ${dest}`);

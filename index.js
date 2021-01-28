const core = require('@actions/core');
const fs = require('fs');
const recursive = require('recursive-readdir');

try {
  const localisationFolder = core.getInput('localisation_folder');
  console.log(`Fixing locs in: ${localisationFolder}`);
  recursive(localisationFolder, ['!*.yml'], (err, files) => {
    if (err) {
      throw err;
    }
    console.log(files);
    for (const file of files) {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          throw err;
        }
        const language = file.replace('.yml', ':').slice(file.indexOf('l_'));
        console.log(language);
        const content = data
          .replace('l_english:', '')
          .replace('---', language)
          .replace('\ufeff', '');
        fs.writeFile(file, `\ufeff${content}`, 'utf8', (err) => {
          if (err) {
            throw err;
          }
          console.log(`Fixed ${file}`);
        });
      });
    }
  });
} catch (error) {
  core.setFailed(error.message);
}

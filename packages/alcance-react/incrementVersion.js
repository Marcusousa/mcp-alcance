const fs = require('fs');
const path = require('path');
const inc = require('semver/functions/inc');

function incrementVersion() {
  const packageJSONPath = path.join(__dirname, 'package.json');
  const packageJSON = require(packageJSONPath);

  const version = packageJSON.version;
  // Incrementa a versão, criando um prerelease com o identificador SNAPSHOT
  const newVersion = inc(version, 'prerelease', 'SNAPSHOT');

  packageJSON.version = newVersion;

  fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2) + '\n');
  return newVersion;
}

const newVersion = incrementVersion();
console.log(newVersion);

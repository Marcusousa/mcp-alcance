const fs = require('fs');
const path = require('path');
const inc = require('semver/functions/inc');

function incrementVersion() {
  const packageJSONPath = path.join(__dirname, 'package.json');
  const versionFilePath = path.join(__dirname, 'src/stories/version.txt');
  const packageJSON = require(packageJSONPath);

  const version = packageJSON.version;
  
  // Salva a versão atual antes do incremento
  fs.writeFileSync(versionFilePath, version);

  // Incrementa a versão, criando um prerelease com o identificador SNAPSHOT
  const newVersion = inc(version, 'prerelease', 'SNAPSHOT');
  packageJSON.version = newVersion;

  fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2) + '\n');

  return newVersion;
}

const newVersion = incrementVersion();
console.log(`Nova versão: ${newVersion}`);
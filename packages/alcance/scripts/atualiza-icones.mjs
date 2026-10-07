// Script para copiar e processar Bootstrap Icons a partir do node_modules
import { promises as fs, readFileSync } from 'fs';
import path from 'path';
import copy from 'recursive-copy';
import { deleteAsync } from 'del';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

// Obter o diretório do script atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  try {
    const iconPackageDir = path.resolve(__dirname, '../node_modules/bootstrap-icons');
    const iconPackageData = JSON.parse(readFileSync(path.join(iconPackageDir, 'package.json'), 'utf8'));
    const iconVersion = iconPackageData.version;
    const destIconDir = path.resolve(__dirname, '../src/assets/icons');

    console.log(`Atualizando Bootstrap Icons v${iconVersion} ...`);

    await deleteAsync([destIconDir]);
    await fs.mkdir(destIconDir, { recursive: true });

    await copy(path.join(iconPackageDir, 'icons'), destIconDir);
    console.log('Ícones copiados.');

    await fs.copyFile(
      path.join(iconPackageDir, 'LICENSE'),
      path.join(destIconDir, 'LICENSE.md')
    );
    console.log('LICENSE copiado.');

    await fs.copyFile(
      path.join(iconPackageDir, 'bootstrap-icons.svg'),
      path.join(destIconDir, 'sprite.svg')
    );
    console.log('Sprite copiado.');

    console.log('Gerando metadados dos ícones...');
    const svgFiles = await fs.readdir(path.join(iconPackageDir, 'icons'));
    const metadata = svgFiles
      .filter((file) => file.endsWith('.svg'))
      .map((file) => {
        const name = path.basename(file, '.svg');
        return {
          name,
          title: name.replace(/-/g, ' '),
          categories: [],
          tags: [],
        };
      });

    await fs.writeFile(
      path.join(destIconDir, 'icons.json'),
      JSON.stringify(metadata, null, 2),
      'utf8'
    );
    console.log('Metadados dos ícones gerados.');

    console.log(chalk.green('Todas as tarefas concluídas com sucesso.'));
  } catch (error) {
    console.error('Ocorreu um erro:', error);
  }
})();
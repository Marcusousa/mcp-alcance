const fs = require('fs');
const path = require('path');

const srcDir = './dist/assets';
const destDir = './src/stories/assets';

function copyRecursive(src, dest) {
    if (fs.statSync(src).isDirectory()) {
        // Se for um diretório, cria um novo diretório no destino
        if (!fs.existsSync(dest)){
            fs.mkdirSync(dest);
        }

        // Lê o diretório
        const files = fs.readdirSync(src);
        files.forEach(file => {
            const srcFile = path.join(src, file);
            const destFile = path.join(dest, file);
            copyRecursive(srcFile, destFile); // Chama a função recursivamente
        });
    } else {
        // Se for um arquivo, simplesmente copia
        fs.copyFileSync(src, dest);
        console.log(`Arquivo ${path.basename(src)} copiado com sucesso!`);
    }
}

copyRecursive(srcDir, destDir);

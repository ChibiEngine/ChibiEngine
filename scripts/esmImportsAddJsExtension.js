import fs from 'fs';
import glob from 'glob';
import path from 'path';

const directoryPath = path.join(process.cwd(), './lib/esm');
const indexFilePath = path.join(directoryPath, 'index.js');

const files = glob.sync('**/*.js', { cwd: directoryPath });

for(const file of files) {
    const filePath = path.resolve(directoryPath, file);
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const newFileContent = fileContent.replace(/(\bfrom\s+["']\..*)(["'])/g, '$1.js$2');
    fs.writeFileSync(filePath, newFileContent, { encoding: 'utf-8' });
}

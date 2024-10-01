/**
 * Inspired by https://github.com/pixijs/pixijs/blob/v8.0.0-beta.3/scripts/index/generateIndexFiles.ts
 * -------------------------------------------------------
 * Generates the index.ts files for the library with
 * all the exports defined
 *
 * We do this to avoid having to manually maintain the index.ts
 * files and reduce circular dependencies
 */

import fs from 'fs';
import glob from 'glob';
import path from 'path';

const directoryPath = path.join(process.cwd(), './src'); // Replace with your directory path
const indexFilePath = path.join(directoryPath, 'index.ts');

// Use glob to find all TypeScript files recursively in the directory
const files = glob.sync('**/*.ts', { cwd: directoryPath });

const ignoredFiles = [
    'ComponentProperty.ts',
    'Mixin.new.ts',
];

// Generate export statements for each file
const exportStatements = files
    .filter((file) => !ignoredFiles.includes(file.substring(file.lastIndexOf('/') + 1)))
    .map((file) => {
  const pathName = file.replace(/\.ts$/, '');
  const content = fs.readFileSync(path.resolve(directoryPath, file), { encoding: 'utf-8' });
  const isTypesOnly = content.startsWith('// types-only');
  if(!content.includes('export default')) {
    return `export ${isTypesOnly ? "type" : ""} * from './${pathName}';`;
  }
  const fileName = pathName.split('/').pop();
  return `export ${isTypesOnly ? "type" : ""} { default as ${fileName} } from './${pathName}';`
});

// Write the export statements to the index.ts file
fs.writeFileSync(indexFilePath, exportStatements.join('\n'), { encoding: 'utf-8' });
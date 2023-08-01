import * as fs from 'fs/promises';
import * as path from 'path';

export const saveJsonFile = async (
  outputDir: string,
  fileName: string,
  data: Record<string, any>
) => {
  await createDirIfNotExists(outputDir);
  const filePath = path.join(outputDir, `${fileName}.json`);
  await saveFile(filePath, data);
};

const saveFile = async (filePath: string, data: Record<string, any>) => {
  try {
    const jsonData = JSON.stringify(data);
    await fs.writeFile(filePath, jsonData);
  } catch (e) {
    throw new Error('Could not save file');
  }
};

const createDirIfNotExists = async (dirPath: string) => {
  try {
    await fs.readdir(dirPath);
  } catch (e) {
    await fs.mkdir(dirPath);
  }
};

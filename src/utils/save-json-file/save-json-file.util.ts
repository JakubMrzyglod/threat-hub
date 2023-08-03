import * as fs from 'fs/promises';
import * as path from 'path';
import { FilePath } from '../../constants';

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

export const startFile = async (outputDir: string, fileName: string) => {
  const filePath = getFilePath(outputDir, fileName);
  await dropFile(filePath);
  await createDirIfNotExists(outputDir);
  await fs.appendFile(filePath, '[');
  return filePath;
};

export const finishFile = (filePath: string) => {
  return fs.appendFile(filePath, ']');
};

export const addItemToFile = (
  filePath: string,
  data: Record<string, any>,
  isFirstItem: boolean
) => {
  const jsonData = `${isFirstItem ? '' : ','}${JSON.stringify(data)}`;
  return fs.appendFile(filePath, jsonData);
};

export const getFilePath = (outputDir: string, fileName: string) =>
  path.join(outputDir, `${fileName}.json`);

const createDirIfNotExists = async (dirPath: string) => {
  try {
    await fs.readdir(dirPath);
  } catch (e) {
    await fs.mkdir(dirPath);
  }
};

const dropFile = async (filePath: string) => {
  try {
    await fs.rm(filePath, { recursive: true, force: true });
  } catch (e) {
    console.log({ e });
  }
};

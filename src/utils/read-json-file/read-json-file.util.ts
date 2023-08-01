import * as fs from 'fs/promises';
import * as path from 'path';

export const readJsonFile = async <R extends Record<string, any>>(
  dirPath: string,
  filePath: string
): Promise<R> => {
  const json = await readFile(dirPath, filePath);
  const data = parseJson<R>(json);

  return data;
};

const readFile = async (dirPath: string, filePath: string): Promise<string> => {
  try {
    const fullFilePath = path.resolve(dirPath, filePath);
    const jsonData = await fs.readFile(fullFilePath, { encoding: 'utf8' });

    return jsonData;
  } catch (e) {
    throw new Error(`Could not read file for path: [${filePath}]`);
  }
};

const parseJson = <R>(jsonData: string): R => {
  try {
    const data = JSON.parse(jsonData);

    return data;
  } catch (e) {
    throw new Error(
      `Could not parse file data for: ${jsonData || '<empty-file>'}`
    );
  }
};

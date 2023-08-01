import { readFile } from 'fs/promises';

export const readJsonFile = async <R extends Record<string, any>>(
  filePath: string
): Promise<R> => {
  try {
    const jsonData = await readFile(filePath, { encoding: 'utf8' });
    const data = JSON.parse(jsonData) as R;
    return data;
  } catch (e) {
    throw new Error(`Could not read file for path: [${filePath}]`);
  }
};

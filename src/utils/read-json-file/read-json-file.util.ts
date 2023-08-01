import * as fs from 'fs/promises';
import * as path from 'path';
import { AnyObject, Schema } from 'yup';

export const readJsonFile = async <R>(
  dirPath: string,
  filePath: string,
  validationSchema?: Schema<R, AnyObject>
): Promise<R> => {
  const json = await readFile(dirPath, filePath);
  const data = parseJson<R>(json);
  await validData(data, validationSchema);

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

const validData = async <R>(
  data: R,
  validationSchema?: Schema<R, AnyObject>
) => {
  if (!validationSchema) {
    return;
  }

  await validationSchema.validate(data);
};

import * as path from 'path';
import { readJsonFile } from './utils';
import { validate } from './utils/validate/validate.util';
import { AnyObject, Schema } from 'yup';
import {
  assetsValidationSchema,
  platformsValidationsSchema,
  vulnerabilitiesValidationSchema,
} from './validation-schemas';
import { Assert, Platform, Vulnerability } from './types';

const FILES_DIR_PATH = path.join(__dirname, 'data');
enum FilePath {
  ASSERTS = './asserts',
  VULNERABILITIES = './vulnerabilities',
  PLATFORMS = './platforms',
}

const getValidData = async <T>(
  filePath: FilePath,
  validationSchema: Schema<T, AnyObject>
) => {
  const data = await readJsonFile<T>(FILES_DIR_PATH, filePath);
  await validate(data, validationSchema);
  return data;
};

const prepareData = (
  data: Assert[] | Vulnerability[]
): [platformId: string, number[]][] => {
  const result: Record<number, number[]> = {};
  for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
    const item = data[dataIndex];
    const platforms = item.platforms;
    for (
      let platformIndex = 0;
      platformIndex < platforms.length;
      platformIndex++
    ) {
      const platform = platforms[platformIndex];
      result[platform.id] ??= [];
      result[platform.id].push(item.id);
    }
  }

  const sortedResult = Object.entries(result).sort((a, b) => +a[0] - +b[0]);

  return sortedResult;
};

const sortPlatforms = (platforms: Platform[]) => {
  const sortedPlatforms = platforms.sort((a, b) => a.id - b.id);

  return sortedPlatforms;
};

const run = async () => {
  const getValidAssertsPromise = getValidData<Assert[]>(
    FilePath.ASSERTS,
    assetsValidationSchema
  );
  const getValidPlatformsPromise = getValidData<Platform[]>(
    FilePath.PLATFORMS,
    platformsValidationsSchema
  );
  const getValidVulnerabilitiesPromise = getValidData<Vulnerability[]>(
    FilePath.PLATFORMS,
    vulnerabilitiesValidationSchema
  );

  const [asserts, vulnerabilities, platforms] = await Promise.all([
    getValidAssertsPromise,
    getValidVulnerabilitiesPromise,
    getValidPlatformsPromise,
  ]);

  const sortedAsserts = prepareData(asserts);
  const sortedVulnerabilities = prepareData(vulnerabilities);
  const sortedPlatforms = sortPlatforms(platforms);
};

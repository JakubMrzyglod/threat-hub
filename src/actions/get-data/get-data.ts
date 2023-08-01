import {
  assetsValidationSchema,
  platformsValidationsSchema,
  vulnerabilitiesValidationSchema,
} from '../../validation-schemas';
import * as path from 'path';
import { readJsonFile, validate } from '../../utils';
import { AnyObject, Schema } from 'yup';
import { Assert, Platform, SortedItem, Vulnerability } from '../../types';
import { FilePath } from '../../constants';

const INPUT_FILES_DIR_PATH = path.join(__dirname, 'inputs');

const getValidData = async <T>(
  filePath: FilePath,
  validationSchema: Schema<T, AnyObject>
) => {
  const data = await readJsonFile<T>(INPUT_FILES_DIR_PATH, filePath);
  await validate(data, validationSchema);
  return data;
};

const prepareData = (data: Assert[] | Vulnerability[]): SortedItem => {
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

export const getData = async () => {
  const getValidAssertsPromise = getValidData<Assert[]>(
    FilePath.ASSERTS,
    assetsValidationSchema
  );
  const getValidPlatformsPromise = getValidData<Platform[]>(
    FilePath.PLATFORMS,
    platformsValidationsSchema
  );
  const getValidVulnerabilitiesPromise = getValidData<Vulnerability[]>(
    FilePath.VULNERABILITIES,
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

  return { sortedAsserts, sortedPlatforms, sortedVulnerabilities };
};

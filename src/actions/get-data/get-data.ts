import * as path from 'path';
import { readJsonFile } from '../../utils';
import {
  Assert,
  Platform,
  SortedItems,
  SortedPlatformDetails,
  Vulnerability,
} from '../../types';
import { FilePath } from '../../constants';

const INPUT_FILES_DIR_PATH = path.join(__dirname, '../../../inputs');

export const prepareValidateData = <T extends Assert | Vulnerability>(
  data: T[],
  requiredFields: (keyof T)[]
): SortedItems => {
  const result: number[][] = [];
  let lastPlatformId = 0;
  for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
    const item = data[dataIndex];
    checkRequiredFields(item, requiredFields);
    const platforms = item.platforms;
    for (
      let platformIndex = 0;
      platformIndex < platforms.length;
      platformIndex++
    ) {
      const platform = platforms[platformIndex];
      if (platform.id > lastPlatformId) {
        lastPlatformId = platform.id;
      }
      result[platform.id] ??= [];
      result[platform.id].push(item.id);
    }
  }

  return { data: result, lastPlatformId };
};

export const checkRequiredFields = <T>(
  item: T,
  requiredFields: (keyof T)[]
) => {
  requiredFields.forEach((fieldName) => {
    const itemValue = item[fieldName];
    const itemValueIsNullable = [undefined, null].includes(itemValue as any);
    if (itemValueIsNullable) {
      throw new Error(`Missing value for ['${fieldName as String}']`);
    }
  });
};

export const sortPlatforms = (
  platforms: Platform[],
  requiredFields: (keyof Platform)[]
): SortedPlatformDetails => {
  const result: SortedPlatformDetails = [];
  for (let platformId = 0; platformId < platforms.length; platformId++) {
    const platformItem = platforms[platformId];
    checkRequiredFields(platformItem, requiredFields);
    result[platformId] = { name: platformItem.name };
  }

  return result;
};

export const getData = async () => {
  const getValidAssertsPromise = readJsonFile<Assert[]>(
    INPUT_FILES_DIR_PATH,
    FilePath.ASSERTS
  );

  const getValidPlatformsPromise = readJsonFile<Platform[]>(
    INPUT_FILES_DIR_PATH,
    FilePath.PLATFORMS
  );

  const getValidVulnerabilitiesPromise = readJsonFile<Vulnerability[]>(
    INPUT_FILES_DIR_PATH,
    FilePath.VULNERABILITIES
  );

  const [asserts, vulnerabilities, platforms] = await Promise.all([
    getValidAssertsPromise,
    getValidVulnerabilitiesPromise,
    getValidPlatformsPromise,
  ]);

  const sortedAsserts = prepareValidateData(asserts, ['id', 'platforms']);
  const sortedVulnerabilities = prepareValidateData(vulnerabilities, [
    'id',
    'platforms',
  ]);
  const sortedPlatforms = sortPlatforms(platforms, ['id', 'name']);

  return { sortedAsserts, sortedPlatforms, sortedVulnerabilities };
};

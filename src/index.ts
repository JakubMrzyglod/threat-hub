import * as path from 'path';
import { readJsonFile } from './utils';
import { validate } from './utils/validate/validate.util';
import { AnyObject, Schema } from 'yup';
import {
  assetsValidationSchema,
  platformsValidationsSchema,
  vulnerabilitiesValidationSchema,
} from './validation-schemas';
import { Assert, Platform, SortedItem, Vulnerability } from './types';
import { saveJsonFile } from './utils/save-json-file/save-json-file.util';

const INPUT_FILES_DIR_PATH = path.join(__dirname, 'inputs');
const OUTPUT_FILES_DIR_PATH = path.join(__dirname, 'outputs');
const OUTPUT_FILE_NAME = 'result';

enum FilePath {
  ASSERTS = './asserts',
  VULNERABILITIES = './vulnerabilities',
  PLATFORMS = './platforms',
}

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

const findItemIndexDetails = (
  items: SortedItem,
  startIndex: number,
  platformId: number
) => {
  for (let index = startIndex; index < items.length; index++) {
    const item = items[index];
    if (+item[0] >= platformId) {
      return { index, isMatched: +item[0] === platformId };
    }
  }
};

const mixIds = (
  assertIds: number[],
  vulnerabilityIds: number[],
  platformDetails: { name: string }
) => {
  const result = [];
  for (let assertIndex = 0; assertIndex < assertIds.length; assertIndex++) {
    for (
      let vulnerabilityIndex = 0;
      vulnerabilityIndex < vulnerabilityIds.length;
      vulnerabilityIndex++
    ) {
      const assertId = assertIds[assertIndex];
      const vulnerabilityId = vulnerabilityIds[vulnerabilityIndex];
      result.push({ ...platformDetails, assertId, vulnerabilityId });
    }
  }

  return result;
};

const getData = async () => {
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

  return { sortedAsserts, sortedPlatforms, sortedVulnerabilities };
};

const run = async () => {
  const { sortedAsserts, sortedPlatforms, sortedVulnerabilities } =
    await getData();

  let currentAssertIndex = 0;
  let currentVulnerabilityIndex = 0;
  const platformPairs = [];

  for (
    let platformIndex = 0;
    platformIndex < sortedPlatforms.length;
    platformIndex++
  ) {
    const currentPlatform = sortedPlatforms[platformIndex];
    const assertIndexDetails = findItemIndexDetails(
      sortedAsserts,
      currentAssertIndex,
      currentPlatform.id
    );

    const vulnerabilityIndexDetails = findItemIndexDetails(
      sortedVulnerabilities,
      currentVulnerabilityIndex,
      currentPlatform.id
    );

    if (!assertIndexDetails || !vulnerabilityIndexDetails) {
      break;
    }

    currentAssertIndex = assertIndexDetails.index;
    currentVulnerabilityIndex = vulnerabilityIndexDetails.index;

    if (
      !assertIndexDetails?.isMatched ||
      !vulnerabilityIndexDetails?.isMatched
    ) {
      continue;
    }

    const platformAssertIds = sortedAsserts[currentAssertIndex][1];
    const platformVulnerabilityAssertIds =
      sortedVulnerabilities[currentVulnerabilityIndex][1];
    const platformDetails = { name: currentPlatform.name };
    const currentPlatformPairs = mixIds(
      platformAssertIds,
      platformVulnerabilityAssertIds,
      platformDetails
    );

    platformPairs.push(...currentPlatformPairs);
  }

  await saveJsonFile(OUTPUT_FILES_DIR_PATH, OUTPUT_FILE_NAME, platformPairs);
};

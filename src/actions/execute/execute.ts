import * as path from 'path';
import { getData } from '../get-data';
import { findItemIndexDetails, mixIds, saveJsonFile } from '../../utils';

const OUTPUT_FILES_DIR_PATH = path.join(__dirname, 'outputs');
const OUTPUT_FILE_NAME = 'result';

export const execute = async () => {
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

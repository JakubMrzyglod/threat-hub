import * as path from 'path';
import { getData } from '../get-data';
import { mixIds } from '../../utils';
import { SaveFileBus } from '../../helpers';
import { platform } from 'os';

const OUTPUT_FILES_DIR_PATH = path.join(__dirname, '../../../outputs');
const OUTPUT_FILE_NAME = 'result';

export const execute = async () => {
  console.time();
  const { sortedAsserts, sortedPlatforms, sortedVulnerabilities } =
    await getData();

  const saveFileBus = new SaveFileBus(OUTPUT_FILES_DIR_PATH, OUTPUT_FILE_NAME);
  await saveFileBus.init();

  for (let platformId = 0; platformId < sortedPlatforms.length; platformId++) {
    const noMoreAsserts = platformId > sortedAsserts.lastPlatformId;
    const noMoreVulnerabilities =
      platformId > sortedVulnerabilities.lastPlatformId;

    if (noMoreAsserts || noMoreVulnerabilities) {
      break;
    }

    const platformDetails = sortedPlatforms[platformId];
    const platformAssertIds = sortedAsserts.data[platformId];
    const platformVulnerabilityAssertIds =
      sortedVulnerabilities.data[platformId];

    if (
      !platformAssertIds ||
      !platformVulnerabilityAssertIds ||
      !platformDetails
    ) {
      continue;
    }

    const platformPairs = mixIds(
      platformAssertIds,
      platformVulnerabilityAssertIds,
      platformDetails
    );

    await saveFileBus.append(platformPairs);
  }

  await saveFileBus.end();

  console.timeEnd();
};

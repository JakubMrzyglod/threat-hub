import * as path from 'path';
import { getData } from '../get-data';
import { mixIds } from '../../utils';
import { SaveFileBus } from '../../helpers';

const OUTPUT_FILES_DIR_PATH = path.join(__dirname, '../../../outputs');
const OUTPUT_FILE_NAME = 'result';

export const execute = async () => {
  console.time();
  console.log('pre data fetching');
  const { sortedAsserts, sortedPlatforms, sortedVulnerabilities } =
    await getData();
  console.log('post data fetching');

  const saveFileBus = new SaveFileBus(OUTPUT_FILES_DIR_PATH, OUTPUT_FILE_NAME);
  console.log('start');
  await saveFileBus.init();

  for (let platformId = 0; platformId < sortedPlatforms.length; platformId++) {
    const currentPlatformDetails = sortedPlatforms[platformId];
    const platformAssertIds = sortedAsserts[platformId];
    const platformVulnerabilityAssertIds = sortedVulnerabilities[platformId];

    if (!platformAssertIds || !platformVulnerabilityAssertIds) {
      continue;
    }

    const currentPlatformPairs = mixIds(
      platformAssertIds,
      platformVulnerabilityAssertIds,
      currentPlatformDetails
    );

    await saveFileBus.append(currentPlatformPairs);
  }

  console.log('finished');

  await saveFileBus.end();

  console.log('end');
  console.timeEnd();
};

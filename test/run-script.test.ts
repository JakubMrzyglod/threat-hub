import { execute } from '../src/actions';
import * as path from 'path';
import { saveJsonFile } from '../src/utils';
import { FilePath } from '../src/constants';

const PLATFORMS_COUNT = 10000;
const ASSERTS_COUNT = 100000;
const VULNERABILITIES_COUNT = 100000;
const MIN_PLATFORM_RELATIONS_COUNT = 2;
const MAX_PLATFORM_RELATIONS_COUNT = 5;

describe('run-script', () => {
  jest.setTimeout(60000)
  const version = { min: 0, max: 1 };
  const random = (max: number, min: number) =>
    Math.floor(Math.random() * (max - min) + min);
  const generateRandomPlatforms = (
    minCount: number,
    maxCount: number,
    platformCount: number
  ) => {
    const count = random(maxCount, minCount);
    const platforms = new Array(count)
      .fill({ version })
      .map((partialPlatform) => {
        const id = random(platformCount, 0);
        return { id, ...partialPlatform };
      });

    return platforms;
  };
  const generateAssertsOrVulnerabilities = (
    count: number,
    platformsCount: number
  ) =>
    new Array(count).fill(null).map((_, id) => ({
      id,
      name: `assert-${id}`,
      platforms: generateRandomPlatforms(
        MIN_PLATFORM_RELATIONS_COUNT,
        MAX_PLATFORM_RELATIONS_COUNT,
        platformsCount
      ),
    }));

  const generatePlatforms = (count: number) =>
    new Array(count)
      .fill(null)
      .map((_, id) => ({ id, name: `platforms-${id}` }));

  it('should crate output file', async () => {
    const platforms = generatePlatforms(PLATFORMS_COUNT);
    const asserts = generateAssertsOrVulnerabilities(
      ASSERTS_COUNT,
      PLATFORMS_COUNT
    );
    const vulnerabilities = generateAssertsOrVulnerabilities(
      VULNERABILITIES_COUNT,
      PLATFORMS_COUNT
    );

    const inputsDir = path.join(__dirname, '../inputs');
    const saveAssertsPromise = saveJsonFile(
      inputsDir,
      FilePath.ASSERTS,
      asserts
    );
    const saveVulnerabilitiesPromise = saveJsonFile(
      inputsDir,
      FilePath.VULNERABILITIES,
      vulnerabilities
    );
    const savePlatformsPromise = saveJsonFile(
      inputsDir,
      FilePath.PLATFORMS,
      platforms
    );

    await Promise.all([
      saveAssertsPromise,
      saveVulnerabilitiesPromise,
      savePlatformsPromise,
    ]);

    // await expect(execute()).resolves.toBeUndefined();
  });
});

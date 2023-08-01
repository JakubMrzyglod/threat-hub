const readJsonFileMockFn = jest.fn();
jest.mock('../../utils/read-json-file', () => ({
  readJsonFile: readJsonFileMockFn,
}));
import { FilePath } from '../../constants';
import { getData } from './get-data';

describe(`get-data`, () => {
  const version = { min: 0, max: 1 };

  it('should prepare correctly data for empty files', async () => {
    readJsonFileMockFn.mockImplementation((_, fileName: FilePath) => {
      switch (fileName) {
        case FilePath.ASSERTS:
          return [];
        case FilePath.PLATFORMS:
          return [];
        case FilePath.VULNERABILITIES:
          return [];
      }
    });
    await expect(getData()).resolves.toEqual({
      sortedAsserts: [],
      sortedPlatforms: [],
      sortedVulnerabilities: [],
    });
  });

  it('should prepare correctly data', async () => {
    readJsonFileMockFn.mockImplementation((_, fileName: FilePath) => {
      switch (fileName) {
        case FilePath.ASSERTS:
          return [
            {
              id: 2,
              name: 'assert 2',
              platforms: [
                { id: 1, version },
                { id: 3, version },
              ],
            },
            {
              id: 1,
              name: 'assert 1',
              platforms: [
                { id: 1, version },
                { id: 2, version },
              ],
            },
          ];
        case FilePath.PLATFORMS:
          return [
            { id: 3, name: 'platform 3' },
            { id: 1, name: 'platform 1' },
            { id: 2, name: 'platform 2' },
          ];
        case FilePath.VULNERABILITIES:
          return [
            {
              id: 1,
              name: 'vulnerability 1',
              platforms: [
                { id: 1, version },
                { id: 2, version },
              ],
            },
            {
              id: 2,
              name: 'vulnerabilities 2',
              platforms: [{ id: 1, version }],
            },
            {
              id: 3,
              name: 'vulnerabilities 3',
              platforms: [{ id: 3, version }],
            },
          ];
      }
    });
    await expect(getData()).resolves.toEqual({
      sortedAsserts: [
        ['1', [2, 1]],
        ['2', [1]],
        ['3', [2]],
      ],
      sortedPlatforms: [
        { id: 1, name: 'platform 1' },
        { id: 2, name: 'platform 2' },
        { id: 3, name: 'platform 3' },
      ],
      sortedVulnerabilities: [
        ['1', [1, 2]],
        ['2', [1]],
        ['3', [3]],
      ],
    });
  });
});

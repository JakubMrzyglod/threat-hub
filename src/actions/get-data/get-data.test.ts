import { FilePath } from '../../constants';
import { Assert } from '../../types';
import { readJsonFile } from '../../utils'; // Import the dependency you want to mock
import {
  checkRequiredFields,
  getData,
  prepareValidateData,
  sortPlatforms,
} from './get-data';

jest.mock('../../utils', () => ({
  readJsonFile: jest.fn(),
}));

describe('Your Module', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('prepareValidateData', () => {
    it('should correctly prepare and validate data', () => {
      // Define your test data
      const data = [
        {
          id: 1,
          name: 'name 1',
          platforms: [{ id: 1, version: { min: 0, max: 1 } }],
        },
        {
          id: 2,
          name: 'name 2',
          platforms: [{ id: 2, version: { min: 0, max: 1 } }],
        },
      ];
      const requiredFields: (keyof Assert)[] = ['id', 'platforms'];

      const result = prepareValidateData<Assert>(data, requiredFields);

      expect(result).toEqual([, [1], [2]]);
    });
  });

  describe('checkRequiredFields', () => {
    it('should throw an error if a required field is missing', () => {
      const item = { id: 1, name: 'Test Name' };
      const requiredFields: (keyof typeof item)[] = ['id', 'platforms'] as any;

      expect(() => checkRequiredFields(item, requiredFields)).toThrow(Error);
    });
  });

  describe('sortPlatforms', () => {
    it('should correctly sort the platforms', () => {
      const platforms = [
        { id: 1, name: 'Platform A' },
        { id: 2, name: 'Platform B' },
      ];
      const requiredFields: (keyof (typeof platforms)[0])[] = ['id', 'name'];

      const result = sortPlatforms(platforms, requiredFields);

      expect(result).toEqual([{ name: 'Platform A' }, { name: 'Platform B' }]);
    });
  });

  describe('getData', () => {
    it('should return the sorted data', async () => {
      (readJsonFile as jest.Mock).mockImplementation((_, filePath: string) => {
        switch (filePath) {
          case FilePath.ASSERTS:
          case FilePath.VULNERABILITIES:
            return [{ id: 1, platforms: [{ id: 1 }] }];
          case FilePath.PLATFORMS:
            return [{ id: 1, name: 'Platform' }];
        }
      });

      const result = await getData();
      expect(result).toEqual({
        sortedAsserts: [, [1]],
        sortedPlatforms: [{ name: 'Platform' }],
        sortedVulnerabilities: [, [1]],
      });
    });
  });
});

describe(`execute`, () => {
  const saveJsonFileMockFn = jest.fn();
  jest.mock('../../../utils/save-json-file', () => ({
    saveJsonFile: saveJsonFileMockFn,
  }));

  it('should prepare correctly result - case 2', async () => {
    jest.mock('../../get-data', () => ({
      getData: () => {
        const sortedAsserts = [
          [1, [1, 2]],
          [2, [3]],
          [5, [2]],
        ];
        const sortedPlatforms = [
          { id: 1, name: 'platform 1' },
          { id: 2, name: 'platform 2' },
          { id: 4, name: 'platform 4' },
        ];
        const sortedVulnerabilities = [
          [1, [1]],
          [2, [2]],
          [3, [3]],
        ];
        return { sortedAsserts, sortedPlatforms, sortedVulnerabilities };
      },
    }));

    const { execute } = require('../execute');
    await expect(execute()).resolves.toEqual(undefined);
    expect(saveJsonFileMockFn).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      [
        { assertId: 1, name: 'platform 1', vulnerabilityId: 1 },
        { assertId: 2, name: 'platform 1', vulnerabilityId: 1 },
        { assertId: 3, name: 'platform 2', vulnerabilityId: 2 },
      ]
    );
  });
});

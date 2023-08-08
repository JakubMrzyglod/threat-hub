describe(`execute`, () => {
  const append = jest.fn();
  jest.mock('../../helpers/save-file-bus', () => ({
    SaveFileBus: jest.fn().mockImplementation(() => ({
      init: jest.fn(),
      end: jest.fn(),
      append,
    })),
  }));

  it('should prepare correctly result', async () => {
    jest.mock('../get-data', () => ({
      getData: () => {
        const sortedAsserts = [[1, 2], [3], [2]];
        const sortedPlatforms = [
          { name: 'platform 1' },
          { name: 'platform 2' },
          ,
          { name: 'platform 4' },
        ];
        const sortedVulnerabilities = [[1], [2], [3]];
        return { sortedAsserts, sortedPlatforms, sortedVulnerabilities };
      },
    }));

    const { execute } = require('../execute');
    await expect(execute()).resolves.toEqual(undefined);
    expect(append).toHaveBeenCalledWith([
      { assertId: 1, name: 'platform 1', vulnerabilityId: 1 },
      { assertId: 2, name: 'platform 1', vulnerabilityId: 1 },
    ]);
    expect(append).toHaveBeenCalledWith([
      { assertId: 3, name: 'platform 2', vulnerabilityId: 2 },
    ]);
  });
});

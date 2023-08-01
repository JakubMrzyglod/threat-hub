import { mixIds } from './mix-ids.util';

describe(`mixIds`, () => {
  it('should find index - no skip', async () => {
    const platformDetails = { name: 'platform name' };
    const assertIds = [1, 2];
    const vulnerabilityIds = [2, 4];

    const mixedIds = mixIds(assertIds, vulnerabilityIds, platformDetails);

    expect(mixedIds).toEqual([
      { assertId: 1, name: 'platform name', vulnerabilityId: 2 },
      { assertId: 1, name: 'platform name', vulnerabilityId: 4 },
      { assertId: 2, name: 'platform name', vulnerabilityId: 2 },
      { assertId: 2, name: 'platform name', vulnerabilityId: 4 },
    ]);
  });
});

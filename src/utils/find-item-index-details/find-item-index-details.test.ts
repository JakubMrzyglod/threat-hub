import { SortedItem } from '../../types';
import { findItemIndexDetails } from './find-item-index-details.util';

describe(`findItemIndexDetails`, () => {
  it('should find index - no skip', async () => {
    const items: SortedItem = [
      ['1', []],
      ['2', []],
    ];
    const startIndex = 0;
    const platformId = 1;

    const indexDetails = findItemIndexDetails(items, startIndex, platformId);

    expect(indexDetails).toEqual({ index: 0, isMatched: true });
  });

  it('should find index - skip', async () => {
    const items: SortedItem = [
      ['1', []],
      ['2', []],
      ['3', []],
      ['4', []],
    ];
    const startIndex = 1;
    const platformId = 3;

    const indexDetails = findItemIndexDetails(items, startIndex, platformId);

    expect(indexDetails).toEqual({ index: 2, isMatched: true });
  });

  it('should find index - skip', async () => {
    const items: SortedItem = [
      ['1', []],
      ['2', []],
      ['4', []],
      ['5', []],
    ];
    const startIndex = 1;
    const platformId = 3;

    const indexDetails = findItemIndexDetails(items, startIndex, platformId);

    expect(indexDetails).toEqual({ index: 2, isMatched: false });
  });

  it('should find index - skip', async () => {
    const items: SortedItem = [
      ['1', []],
      ['2', []],
    ];
    const startIndex = 0;
    const platformId = 3;

    const indexDetails = findItemIndexDetails(items, startIndex, platformId);

    expect(indexDetails).toBeUndefined();
  });
});

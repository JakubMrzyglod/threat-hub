import { SortedItem } from '../types';

export const findItemIndexDetails = (
  items: SortedItem,
  startIndex: number,
  platformId: number
) => {
  for (let index = startIndex; index < items.length; index++) {
    const item = items[index];
    if (+item[0] >= platformId) {
      return { index, isMatched: +item[0] === platformId };
    }
  }
};

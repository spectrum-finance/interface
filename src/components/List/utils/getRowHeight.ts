import { uint } from '../../../common/types';
import { BASE_GUTTER } from './constants';

export const getRowHeight = (
  index: number,
  itemCount: uint,
  selectedItems: uint[],
  itemHeight: number,
  expandHeight: number,
  gap = 0,
): number => {
  const isItemSelected = selectedItems.includes(index);

  if (index === itemCount - 1) {
    return isItemSelected ? itemHeight + expandHeight : itemHeight;
  }

  return (
    (isItemSelected ? itemHeight + expandHeight : itemHeight) +
    gap * BASE_GUTTER
  );
};

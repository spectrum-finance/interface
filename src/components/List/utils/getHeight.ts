import { CSSProperties } from 'react';

import { uint } from '../../../common/types';
import { BASE_GUTTER } from './constants';
import { normalizeMeasure } from './normalizeMeasure';

export const getHeight = (
  height: CSSProperties['height'],
  maxHeight: CSSProperties['height'],
  expandHeight: number,
  itemCount: uint,
  selectedItemsCount: uint,
  itemHeight: number,
  gap = 0,
): CSSProperties['height'] => {
  if (!!height) {
    return height;
  }
  const estimatedHeight =
    (itemHeight + BASE_GUTTER * gap) * (itemCount - selectedItemsCount) +
    (itemHeight + expandHeight + BASE_GUTTER * gap) * selectedItemsCount -
    BASE_GUTTER * gap;

  if (!!maxHeight) {
    return `min(${normalizeMeasure(maxHeight)}, ${normalizeMeasure(
      estimatedHeight,
    )})`;
  }
  return undefined;
};

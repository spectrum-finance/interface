import { CSSProperties, FC } from 'react';

import { uint } from '../../../common/types';
import { Expand } from '../../List/common/Expand';

export interface ExpandComponentProps<T> {
  readonly index: uint;
  readonly item: T;
  readonly collapse: () => void;
  readonly expandContentHeight: CSSProperties['height'];
}

export interface TableExpand<T> extends Expand {
  readonly component: FC<ExpandComponentProps<T>>;
}

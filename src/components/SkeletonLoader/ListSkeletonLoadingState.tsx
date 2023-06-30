import { FC } from 'react';

import { makeSkeletonLoader } from './makeSkeletonLoader.tsx';
import { SkeletonLoader } from './SkeletonLoader.tsx';

export const ListSkeletonLoadingState: FC = () =>
  makeSkeletonLoader(<SkeletonLoader height={78} />, 9);

import { FC } from 'react';

import { makeSkeletonLoader } from '../../../../../components/SkeletonLoader/makeSkeletonLoader.tsx';
import { SkeletonLoader } from '../../../../../components/SkeletonLoader/SkeletonLoader.tsx';

export const PositionsLoadingState: FC = () =>
  makeSkeletonLoader(<SkeletonLoader height={78} />, 9);

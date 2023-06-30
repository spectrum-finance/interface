import { FC } from 'react';

import { makeSkeletonLoader } from './makeSkeletonLoader.tsx';
import { SkeletonLoader } from './SkeletonLoader.tsx';

interface ListSkeletonLoadingStateProps {
  numOfElements?: number;
}
export const ListSkeletonLoadingState: FC<ListSkeletonLoadingStateProps> = ({
  numOfElements,
}) =>
  makeSkeletonLoader(
    <SkeletonLoader height={78} />,
    numOfElements ? numOfElements : 9,
  );

import { Flex, useDevice } from '@ergolabs/ui-kit';
import { Progress } from '@ergolabs/ui-kit/dist/components/Progress/Progress';
import { FC } from 'react';

import { Farm } from '../../../../../common/models/Farm';

export interface DistributedColumnProps {
  readonly farm: Farm;
}

export const FarmDistributedColumn: FC<DistributedColumnProps> = ({ farm }) => {
  const { valBySize } = useDevice();

  return (
    <Flex width={valBySize(110, 110, 206, 160)}>
      <Progress percent={farm.distributed} strokeWidth={24} />
    </Flex>
  );
};

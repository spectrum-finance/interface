import {
  Box,
  Flex,
  SwapRightOutlined,
  Typography,
  useDevice,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { Farm, FarmStatus } from '../../../../../common/models/Farm';

export interface LivePeriodCellProps {
  readonly farm: Farm;
}

export const LivePeriodCell: FC<LivePeriodCellProps> = ({ farm }) => {
  const { s } = useDevice();

  return (
    <Box
      width="100%"
      height="100%"
      transparent
      bordered={false}
      padding={[0, 4]}
    >
      <Flex col justify="center" stretch>
        {farm.status === FarmStatus.Scheduled && (
          <>
            <Typography.Body secondary size="small">
              <Trans>Starts with a block</Trans>
            </Typography.Body>
            <Typography.Body strong>
              {farm.programStartBlock}
            </Typography.Body>
          </>
        )}
        {farm.status !== FarmStatus.Scheduled && (
          <>
            <Typography.Body secondary size="small">
              <Trans>Live Period</Trans>
            </Typography.Body>
            <Typography.Body strong>
              <Flex col={s} inline align="center">
                <Flex.Item marginRight={!s ? 1 : 0}>
                  {farm.startDateTime.toFormat('yyyy-MM-dd')}
                </Flex.Item>
                <Flex.Item marginRight={!s ? 1 : 0}>
                  <Typography.Body secondary>
                    <SwapRightOutlined disabled={true} />
                  </Typography.Body>
                </Flex.Item>
                {farm.endDateTime.toFormat('yyyy-MM-dd')}
              </Flex>
            </Typography.Body>
          </>
        )}
      </Flex>
    </Box>
  );
};

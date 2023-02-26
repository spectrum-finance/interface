import { Box, Flex, Typography, useDevice } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { Position } from '../../../common/models/Position';
import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';

export interface PriceHistoryProps {
  readonly position: Position;
}

export const PriceHistory: FC<PriceHistoryProps> = () => {
  const { valBySize } = useDevice();

  return (
    <Box
      glass
      borderRadius="l"
      padding={4}
      height={valBySize(undefined, 277, 291)}
    >
      <Flex col>
        <Flex.Item marginBottom={2}>
          <InfoTooltip content={<>1</>} secondary>
            <Typography.Body strong>
              <Trans>Price history</Trans>
            </Typography.Body>
          </InfoTooltip>
        </Flex.Item>
      </Flex>
    </Box>
  );
};

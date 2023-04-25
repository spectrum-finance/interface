import { Box, Button, Flex } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Position } from '../../../../../../common/models/Position';
import { ExpandComponentProps } from '../../../../../../components/TableView/common/Expand';
import { DetailRow, DetailsBox } from '../../DetailsBox/DetailsBox';

const StyledButton = styled(Button)`
  width: 100%;
`;

export const LockedPositionDetails: FC<ExpandComponentProps<Position>> = ({
  item,
}) => {
  const navigate = useNavigate();

  return (
    <Box transparent padding={2} bordered={false}>
      <Flex col>
        <DetailRow marginBottom={2}>
          <DetailsBox
            title={<Trans>Total Locked</Trans>}
            value={
              <Flex col>
                <Flex.Item marginBottom={1} display="flex" justify="flex-end">
                  {item.lockedX.asset.ticker}: {item.lockedX.toString()}
                </Flex.Item>
                <Flex.Item display="flex" justify="flex-end">
                  {item.lockedY.asset.ticker}: {item.lockedY.toString()}
                </Flex.Item>
              </Flex>
            }
          />
        </DetailRow>
        <DetailRow marginBottom={4}>
          <DetailsBox
            title={<Trans>Total withdrawable </Trans>}
            value={
              <Flex col>
                <Flex.Item marginBottom={1} display="flex" justify="flex-end">
                  {item.withdrawableLockedX.asset.ticker}:{' '}
                  {item.withdrawableLockedX.toString()}
                </Flex.Item>
                <Flex.Item display="flex" justify="flex-end">
                  {item.withdrawableLockedY.asset.ticker}:{' '}
                  {item.withdrawableLockedY.toString()}
                </Flex.Item>
              </Flex>
            }
          />
        </DetailRow>
        <Flex.Item display="flex" align="center">
          <Flex.Item flex={1} marginRight={2}>
            <StyledButton onClick={() => navigate(`${item.pool.id}/relock`)}>
              <Trans>Relock</Trans>
            </StyledButton>
          </Flex.Item>
          <Flex.Item flex={1}>
            <StyledButton
              type="primary"
              onClick={() => navigate(`${item.pool.id}/withdrawal`)}
            >
              <Trans>Withdrawal</Trans>
            </StyledButton>
          </Flex.Item>
        </Flex.Item>
      </Flex>
    </Box>
  );
};

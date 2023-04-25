import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

import { OperationType } from '../../../../../network/ergo/api/operations/history/v2/types/BaseOperation';
import { OperationItem } from '../../../../../network/ergo/api/operations/history/v2/types/OperationItem';

const mapOperationItemTypeToCaption = {
  [OperationType.Swap]: t`Swap`,
  [OperationType.AddLiquidity]: t`Add liquidity`,
  [OperationType.RemoveLiquidity]: t`Remove liquidity`,
  [OperationType.LmDeposit]: t`Stake`,
  [OperationType.LmRedeem]: t`Unstake`,
  [OperationType.ReLockLiquidity]: t`Relock Liquidity`,
  [OperationType.WithdrawLock]: t`Withdraw Liquidity`,
  [OperationType.LockLiquidity]: t`Lock Liquidity`,
};

export interface TypeCellProps {
  readonly operationItem: OperationItem;
}

export const TypeCell: FC<TypeCellProps> = ({ operationItem }) => (
  <Flex justify="flex-start">
    <Box inline padding={[0, 2]} borderRadius="s">
      <Typography.Body size="small">
        {mapOperationItemTypeToCaption[operationItem.type]}
      </Typography.Body>
    </Box>
  </Flex>
);

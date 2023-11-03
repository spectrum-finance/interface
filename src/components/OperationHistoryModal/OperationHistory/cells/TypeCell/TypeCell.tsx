import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

import {
  OperationItem,
  OperationType,
} from '../../../../../common/models/OperationV2';
import styles from './TypeCell.module.less';

export interface TypeCellProps {
  readonly operationItem: OperationItem;
}

export const TypeCell: FC<TypeCellProps> = ({ operationItem }) => {
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

  return (
    <Flex
      justify="center"
      align="center"
      width={100}
      className={styles.typeCell}
    >
      <Box inline padding={[1, 2]} borderRadius="s" width="100%">
        <Typography.Body size="small" align="center">
          {mapOperationItemTypeToCaption[operationItem.type]}
        </Typography.Body>
      </Box>
    </Flex>
  );
};

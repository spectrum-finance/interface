import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { FC } from 'react';

import {
  OperationItem,
  OperationStatus,
} from '../../../../../common/models/OperationV2';
import { AssetIcon } from '../../../../AssetIcon/AssetIcon';
//import { ConvenientAssetView } from '../../../../ConvenientAssetView/ConvenientAssetView';
import { InfoTooltip } from '../../../../InfoTooltip/InfoTooltip';
import styles from './FeeCell.module.less';

export interface FeeCellProps {
  readonly operationItem: OperationItem;
}

export const FeeCell: FC<FeeCellProps> = ({ operationItem }) => (
  <Flex justify="flex-start" width={90} className={styles.feeCell}>
    <Box padding={[1, 2]} bordered={false} borderRadius="s" width="100%">
      {operationItem.status === OperationStatus.Evaluated ? (
        <InfoTooltip
          color="secondary"
          content={
            <Flex col>
              {operationItem.fee.map((feeItem, i) => (
                <Flex.Item
                  display="flex"
                  align="center"
                  key={i}
                  marginBottom={i === operationItem.fee.length - 1 ? 0 : 1}
                >
                  <Flex.Item marginRight={1}>{feeItem.caption}:</Flex.Item>
                  <Flex.Item marginRight={1}>
                    <AssetIcon asset={feeItem.value.asset} size="extraSmall" />
                  </Flex.Item>
                  {feeItem.value.toCurrencyString()}
                </Flex.Item>
              ))}
            </Flex>
          }
        >
          <Typography.Body size="small">
            {operationItem.fee.map((feeItem) =>
              feeItem.value.toCurrencyString(2),
            )}
            {/*  <ConvenientAssetView
              value={operationItem.fee.map((feeItem) => feeItem.value)}
            /> */}
          </Typography.Body>
        </InfoTooltip>
      ) : (
        '–'
      )}
    </Box>
  </Flex>
);

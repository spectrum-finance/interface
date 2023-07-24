import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { FC } from 'react';

import {
  OperationItem,
  OperationStatus,
} from '../../../../../common/models/OperationV2';
import { AssetIcon } from '../../../../AssetIcon/AssetIcon';
import { ConvenientAssetView } from '../../../../ConvenientAssetView/ConvenientAssetView';
import { InfoTooltip } from '../../../../InfoTooltip/InfoTooltip';

export interface FeeCellProps {
  readonly operationItem: OperationItem;
}

export const FeeCell: FC<FeeCellProps> = ({ operationItem }) => (
  <Flex justify="flex-start">
    <Box padding={[0, 1]} bordered={false} borderRadius="s">
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
          width={300}
        >
          <Typography.Body size="small">
            <ConvenientAssetView
              value={operationItem.fee.map((feeItem) => feeItem.value)}
            />
          </Typography.Body>
        </InfoTooltip>
      ) : (
        '–'
      )}
    </Box>
  </Flex>
);

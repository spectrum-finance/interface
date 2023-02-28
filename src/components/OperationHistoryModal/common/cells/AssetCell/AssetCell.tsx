import { Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { Operation } from '../../../../../common/models/Operation';
import { ArrowIcon } from '../SwapAssetCell/ArrowIcon/ArrowIcon';
import { AssetBox } from '../SwapAssetCell/AssetBox/AssetBox';

export interface SwapAssetCellProps {
  readonly operation: Operation;
}

export const AssetCell: FC<SwapAssetCellProps> = ({ operation }) => {
  const isSwapOp = operation.type === 'swap';

  return (
    <Flex col width={188}>
      <Flex.Item marginBottom={1}>
        <AssetBox currency={isSwapOp ? operation.base : operation.x} />
      </Flex.Item>
      {isSwapOp && <ArrowIcon />}
      <Flex.Item>
        <AssetBox currency={isSwapOp ? operation.quote : operation.y} />
      </Flex.Item>
    </Flex>
  );
};

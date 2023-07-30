import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { Currency } from '../../../../../common/models/Currency';
import { AssetIcon } from '../../../../AssetIcon/AssetIcon';
import { AssetPairTitle } from '../../../../AssetPairTitle/AssetPairTitle';
import { InfoTooltip } from '../../../../InfoTooltip/InfoTooltip';
import { AssetBox } from '../AssetBox/AssetBox';

export interface LpAssetBoxProps {
  readonly lpCurrency: Currency;
  readonly xCurrency: Currency;
  readonly yCurrency: Currency;
}

export const LpAssetBox: FC<LpAssetBoxProps> = ({
  lpCurrency,
  yCurrency,
  xCurrency,
}) => (
  <AssetBox
    title={
      <AssetPairTitle
        level={5}
        assetX={xCurrency.asset}
        assetY={yCurrency.asset}
        gap={1}
      />
    }
    value={
      <InfoTooltip
        content={
          <Flex col>
            <Flex.Item display="flex" align="center" marginBottom={1}>
              <Flex.Item marginRight={1}>
                <AssetIcon size="small" asset={xCurrency.asset} />
              </Flex.Item>
              {xCurrency.toCurrencyString()}
            </Flex.Item>
            <Flex.Item display="flex" align="center">
              <Flex.Item marginRight={1}>
                <AssetIcon size="small" asset={yCurrency.asset} />
              </Flex.Item>
              {yCurrency.toCurrencyString()}
            </Flex.Item>
          </Flex>
        }
        width={300}
        color="secondary"
      >
        {lpCurrency.toString(Math.max(lpCurrency.asset.decimals || 0, 2), 2)}
      </InfoTooltip>
    }
  />
);

import React from 'react';

import { Currency } from '../../../../common/models/Currency';
import { ArrowRightOutlined, Flex, Typography } from '../../../../ergodex-cdk';
import { AssetIcon } from '../../../AssetIcon/AssetIcon';
import { TokenIconPair } from '../../../AssetIconPair/TokenIconPair';
import { OperationType } from '../types';

interface InputOutputColumnProps {
  x: Currency;
  y: Currency;
  type: OperationType;
}

const InputOutputColumn: React.FC<InputOutputColumnProps> = ({
  x,
  y,
  type,
}) => {
  if (type === 'deposit' || type === 'redeem') {
    return (
      <Flex align="center">
        <Flex.Item marginRight={2}>
          <TokenIconPair assetX={x.asset} assetY={y.asset} />
        </Flex.Item>
        <Flex.Item>
          <Flex>
            <Flex.Item marginRight={2}>
              <Flex direction="col">
                <Flex.Item>
                  <Typography.Body strong>
                    {x.asset.name}
                    {x.amount ? ':' : ''}
                  </Typography.Body>
                </Flex.Item>
                <Flex.Item>
                  <Typography.Body strong>
                    {y.asset.name}
                    {y.amount ? ':' : ''}
                  </Typography.Body>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Flex direction="col">
                <Flex.Item>
                  <Typography.Footnote>
                    {x.amount ? x.toString() : ''}
                  </Typography.Footnote>
                </Flex.Item>
                <Flex.Item>
                  <Typography.Footnote>
                    {y.amount ? y.toString() : ''}
                  </Typography.Footnote>
                </Flex.Item>
              </Flex>
            </Flex.Item>
          </Flex>
        </Flex.Item>
      </Flex>
    );
  }

  return (
    <Flex>
      <Flex.Item marginRight={2}>
        <Flex align="center">
          <Flex.Item marginRight={1}>
            <AssetIcon asset={x.asset} />
          </Flex.Item>
          <Typography.Body strong>{x.asset.name}</Typography.Body>
        </Flex>
      </Flex.Item>
      <Flex.Item marginRight={2}>
        <Typography.Body>
          <ArrowRightOutlined />
        </Typography.Body>
      </Flex.Item>
      <Flex.Item>
        <Flex align="center">
          <Flex.Item marginRight={1}>
            <AssetIcon asset={y.asset} />
          </Flex.Item>
          <Typography.Body strong>{y.asset.name}</Typography.Body>
        </Flex>
      </Flex.Item>
    </Flex>
  );
};

export { InputOutputColumn };

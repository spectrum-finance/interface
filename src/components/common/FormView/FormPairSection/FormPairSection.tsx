import React, { ReactNode } from 'react';

import { Currency } from '../../../../common/models/Currency';
import { Flex, Typography } from '../../../../ergodex-cdk';
import { AssetIcon } from '../../../AssetIcon/AssetIcon';
import { PageSection } from '../../../Page/PageSection/PageSection';
import { Truncate } from '../../../Truncate/Truncate';
import { UsdView } from '../../../UsdView/UsdView';

interface PairSpaceProps {
  readonly title: string;
  readonly xAmount: Currency;
  readonly yAmount: Currency;
  readonly fees?: boolean;
  readonly children?: ReactNode | ReactNode[];
}

const TOKEN_NAME_SYMBOLS_LIMIT = 15;

const FormPairSection: React.FC<PairSpaceProps> = ({
  title,
  xAmount,
  yAmount,
  fees,
  children,
}): JSX.Element => {
  return (
    <PageSection title={title}>
      <Flex direction="col">
        <Flex.Item marginBottom={2}>
          <Flex justify="space-between" align="center">
            <Flex.Item>
              <Flex align="center">
                <Flex.Item marginRight={2}>
                  <AssetIcon asset={xAmount.asset} />
                </Flex.Item>
                <Flex.Item>
                  <Typography.Body strong>
                    <Truncate limit={TOKEN_NAME_SYMBOLS_LIMIT}>
                      {xAmount.asset.name}
                    </Truncate>
                  </Typography.Body>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Flex>
                <Typography.Body strong>
                  {fees ? undefined : xAmount.toString()} (
                  <UsdView value={xAmount} prefix="~" />)
                </Typography.Body>
              </Flex>
            </Flex.Item>
          </Flex>
        </Flex.Item>
        <Flex.Item marginBottom={children ? 2 : 0}>
          <Flex justify="space-between">
            <Flex.Item>
              <Flex>
                <Flex.Item marginRight={2}>
                  <AssetIcon asset={yAmount.asset} />
                </Flex.Item>
                <Flex.Item>
                  <Typography.Body strong>
                    <Truncate limit={TOKEN_NAME_SYMBOLS_LIMIT}>
                      {yAmount.asset.name}
                    </Truncate>
                  </Typography.Body>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Flex>
                <Typography.Body strong>
                  {fees ? undefined : yAmount.toString()} (
                  <UsdView value={yAmount} prefix="~" />)
                </Typography.Body>
              </Flex>
            </Flex.Item>
          </Flex>
        </Flex.Item>
        {children}
      </Flex>
    </PageSection>
  );
};

export { FormPairSection };

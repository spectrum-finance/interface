import React, { ReactNode } from 'react';

import { Currency } from '../../../../common/models/Currency';
import { Flex, Typography } from '../../../../ergodex-cdk';
import { PageSection } from '../../../Page/PageSection/PageSection';
import { TokenIcon } from '../../../TokenIcon/TokenIcon';

interface PairSpaceProps {
  readonly title: string;
  readonly xAmount: Currency;
  readonly yAmount: Currency;
  readonly fees?: boolean;
  readonly children?: ReactNode | ReactNode[];
}

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
                  <TokenIcon asset={xAmount.asset} />
                </Flex.Item>
                <Flex.Item>
                  <Typography.Body strong>{xAmount.asset.name}</Typography.Body>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Flex>
                <Typography.Body strong>
                  {fees ? undefined : xAmount.toString()}
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
                  <TokenIcon asset={yAmount.asset} />
                </Flex.Item>
                <Flex.Item>
                  <Typography.Body strong>{yAmount.asset.name}</Typography.Body>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Flex>
                <Typography.Body strong>
                  {fees ? undefined : yAmount.toString()}
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

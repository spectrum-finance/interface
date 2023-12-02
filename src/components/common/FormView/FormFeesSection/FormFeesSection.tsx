import { Flex, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import * as React from 'react';

import { UI_FEE } from '../../../../common/constants/erg';
import { Currency } from '../../../../common/models/Currency';
import { InfoTooltip } from '../../../InfoTooltip/InfoTooltip';
import { PageSection } from '../../../Page/PageSection/PageSection';

interface FormFeesSection {
  minerFee?: number;
  minExFee?: Currency;
  totalFees: Currency;
}

const FormFeesSection: React.FC<FormFeesSection> = ({
  minerFee,
  minExFee,
  totalFees,
}) => {
  return (
    <PageSection title={t`Fees`}>
      <Flex justify="space-between">
        <Flex.Item>
          <Typography.Text strong>Fees</Typography.Text>
          {(minerFee || UI_FEE) && (
            <InfoTooltip
              placement="rightBottom"
              content={
                <Flex direction="col">
                  <Flex.Item>
                    <Flex>
                      <Flex.Item marginRight={1}>
                        <Trans>Network Fee:</Trans>
                      </Flex.Item>
                      <Flex.Item>{minerFee} ERG</Flex.Item>
                    </Flex>
                  </Flex.Item>
                  {!!minExFee && (
                    <Flex.Item>
                      <Flex>
                        <Flex.Item marginRight={1}>
                          <Trans>Honey 🍯:</Trans>
                        </Flex.Item>
                        <Flex.Item>{minExFee.toCurrencyString()}</Flex.Item>
                      </Flex>
                    </Flex.Item>
                  )}
                  {!!UI_FEE && (
                    <Flex.Item>
                      <Flex>
                        <Flex.Item marginRight={1}>
                          <Trans>UI Fee:</Trans>
                        </Flex.Item>
                        <Flex.Item>{UI_FEE} ERG</Flex.Item>
                      </Flex>
                    </Flex.Item>
                  )}
                </Flex>
              }
            />
          )}
        </Flex.Item>

        <Flex.Item>
          <Typography.Body strong>
            {totalFees.toCurrencyString()}
          </Typography.Body>
        </Flex.Item>
      </Flex>
    </PageSection>
  );
};

export { FormFeesSection };

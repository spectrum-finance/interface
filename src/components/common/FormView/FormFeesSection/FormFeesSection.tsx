import React from 'react';

import { UI_FEE } from '../../../../common/constants/erg';
import { Currency } from '../../../../common/models/Currency';
import { Flex, Typography } from '../../../../ergodex-cdk';
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
    <PageSection title="Fees">
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
                      <Flex.Item marginRight={1}>Miner Fee:</Flex.Item>
                      <Flex.Item>{minerFee} ERG</Flex.Item>
                    </Flex>
                  </Flex.Item>
                  {!!minExFee && (
                    <Flex.Item>
                      <Flex>
                        <Flex.Item marginRight={1}>Execution Fee:</Flex.Item>
                        <Flex.Item>{minExFee.toString()}</Flex.Item>
                      </Flex>
                    </Flex.Item>
                  )}
                  {!!UI_FEE && (
                    <Flex.Item>
                      <Flex>
                        <Flex.Item marginRight={1}>UI Fee:</Flex.Item>
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
          <Typography.Text strong>{totalFees.toString()}</Typography.Text>
        </Flex.Item>
      </Flex>
    </PageSection>
  );
};

export { FormFeesSection };

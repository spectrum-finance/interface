import { Flex, InfoCircleOutlined, Tooltip } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import styled from 'styled-components';

import {
  LBSP_BOOSTED_MULTIPLIER,
  LBSP_COEFFICIENT,
  LBSP_MULTIPLIER,
} from '../../pages/Liquidity/common/columns/PoolsOrPositionsColumns/columns/AprColumn/CardanoAprColumnContent/calculateLbspApr.ts';
import { math } from '../../utils/math.ts';
import { SpfLogo } from '../SpfLogo/SpfLogo.tsx';

const LbspPoolTagWrapper = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  color: #ffffff;
  background: linear-gradient(71.04deg, #3b41c5 0%, #a981bb 49%, #ff7c32 100%);
  padding: 2px 8px;
  border-radius: 6px;
`;
export const LbspPoolTag: FC<{ isSpf: boolean }> = ({ isSpf }) => (
  <LbspPoolTagWrapper>
    <Tooltip
      width={300}
      title={
        <Flex col>
          <Flex.Item>
            <Trans>This Liquidity Pool generates SPF Rewards</Trans>
          </Flex.Item>
          <Flex.Item>
            <Trans>
              {isSpf
                ? math.evaluate!(
                    `${LBSP_BOOSTED_MULTIPLIER} * ${LBSP_COEFFICIENT}`,
                  )
                : math.evaluate!(
                    `${LBSP_MULTIPLIER} * ${LBSP_COEFFICIENT}`,
                  )}{' '}
              <SpfLogo w={16} h={16} /> SPF per 1 ADA per epoch
            </Trans>
          </Flex.Item>
        </Flex>
      }
    >
      <Flex>
        <Flex.Item marginRight={1}>{isSpf ? '⚡️Boosted ' : ''}LBSP</Flex.Item>
        <Flex.Item>
          <InfoCircleOutlined />
        </Flex.Item>
      </Flex>
    </Tooltip>
  </LbspPoolTagWrapper>
);

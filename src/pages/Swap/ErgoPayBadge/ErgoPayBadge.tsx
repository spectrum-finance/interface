import { Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { IsErgo } from '../../../components/IsErgo/IsErgo';
import { useSettings } from '../../../network/ergo/settings/settings';

const Dot = styled.div`
  background: var(--spectrum-success-color);
  border-radius: 50%;
  height: 6px;
  width: 6px;
`;

export const ErgoPayBadge: FC = () => {
  const [{ ergopay }] = useSettings();

  return (
    <IsErgo>
      {ergopay && (
        <Flex align="center">
          <Flex.Item marginRight={1}>
            <Dot />
          </Flex.Item>
          <Typography.Body size="small" type="success">
            ErgoPay
          </Typography.Body>
        </Flex>
      )}
    </IsErgo>
  );
};

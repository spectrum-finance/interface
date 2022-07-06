import { Flex, useDevice } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { applicationConfig } from '../../../../applicationConfig';
import { IsCardano } from '../../../IsCardano/IsCardano';

export interface CardanoMaintenanceProps {
  readonly className?: string;
}

const _CardanoMaintenance: FC<CardanoMaintenanceProps> = ({ className }) => {
  const { s, m } = useDevice();
  if (s || m) {
    return null;
  }
  return (
    <IsCardano>
      {applicationConfig.cardanoMaintenance && (
        <Flex className={className} align="center" justify="center">
          <Trans>
            Cardano testnet is under maintenance. Some operations may not work
            as expected. We are working on it.
          </Trans>
        </Flex>
      )}
    </IsCardano>
  );
};

export const CardanoMaintenance = styled(_CardanoMaintenance)`
  height: 30px;
  background: #177ddc;
  color: #dbdbdb;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
`;

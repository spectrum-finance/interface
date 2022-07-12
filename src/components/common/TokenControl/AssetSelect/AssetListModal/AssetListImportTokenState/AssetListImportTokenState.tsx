import { Alert, Button, Flex, Modal } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { Checkbox } from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components';

import { useNetworkAsset } from '../../../../../../gateway/api/networkAsset';
import { ImportTokenInfo } from './ImportTokenInfo/ImportTokenInfo';
import { ImportTokenWarning } from './ImportTokenWarning/ImportTokenWarning';

const StyledAlert = styled(Alert)`
  width: 100%;
`;

const plainOptions = ['Apple', 'Pear', 'Orange'];

export const AssetListImportTokenState: FC = () => {
  const [networkAsset] = useNetworkAsset();

  return (
    <>
      <Modal.Title>
        <Trans>Import token</Trans>
      </Modal.Title>
      <Modal.Content width={500}>
        <Flex col>
          <Flex.Item marginBottom={6}>
            <StyledAlert type="warning" description={<ImportTokenWarning />} />
          </Flex.Item>
          <Flex.Item marginBottom={6}>
            <ImportTokenInfo asset={networkAsset} />
          </Flex.Item>
          <Flex.Item>
            <Checkbox.Group options={plainOptions} />
          </Flex.Item>
        </Flex>
      </Modal.Content>
    </>
  );
};

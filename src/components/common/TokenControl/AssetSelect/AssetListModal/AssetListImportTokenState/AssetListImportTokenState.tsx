import { Alert, Flex } from '@ergolabs/ui-kit';
import first from 'lodash/first';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../../../../common/hooks/useObservable';
import { AssetInfo } from '../../../../../../common/models/AssetInfo';
import { getAvailableAssetToImportFor } from '../../../../../../gateway/api/assets';
import { SubmitButton } from '../../../../../SubmitButton/SubmitButton';
import { ImportTokenInfo } from './ImportTokenInfo/ImportTokenInfo';
import { ImportTokenPairSelectControl } from './ImportTokenPairSelectControl/ImportTokenPairSelectControl';
import { ImportTokenWarning } from './ImportTokenWarning/ImportTokenWarning';

const StyledAlert = styled(Alert)`
  width: 100%;
`;

export interface AssetListImportTokenStateProps {
  readonly asset: AssetInfo;
  readonly onAssetsImport: (mainAsset: AssetInfo, assets: AssetInfo[]) => void;
}

export const AssetListImportTokenState: FC<AssetListImportTokenStateProps> = ({
  asset,
  onAssetsImport,
}) => {
  const [selectedPairTokens, setSelectedPairTokens] = useState<
    AssetInfo[] | undefined
  >();
  const [toImportPairTokens] = useObservable(
    getAvailableAssetToImportFor(asset.id),
    [],
    [],
  );

  useEffect(() => {
    if (!selectedPairTokens && !!toImportPairTokens.length) {
      setSelectedPairTokens([first(toImportPairTokens)!]);
    }
  }, [toImportPairTokens]);

  return (
    <Flex col>
      <Flex.Item marginBottom={6}>
        <StyledAlert type="warning" description={<ImportTokenWarning />} />
      </Flex.Item>
      <Flex.Item marginBottom={6}>
        <ImportTokenInfo asset={asset} />
      </Flex.Item>
      <Flex.Item marginBottom={6}>
        <ImportTokenPairSelectControl
          value={selectedPairTokens}
          onChange={setSelectedPairTokens}
          assets={toImportPairTokens}
          mainAsset={asset}
        />
      </Flex.Item>
      <SubmitButton
        disabled={!selectedPairTokens?.length}
        onClick={() => onAssetsImport(asset, selectedPairTokens || [])}
      >
        Import
      </SubmitButton>
    </Flex>
  );
};

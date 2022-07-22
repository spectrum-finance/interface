import { AssetInfo } from '@ergolabs/ergo-sdk';
import {
  ArrowLeftOutlined,
  Flex,
  Modal,
  Typography,
  useDevice,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { CSSProperties, useState } from 'react';
import { Observable } from 'rxjs';
import styled from 'styled-components';

import { importTokenAsset } from '../../../../../gateway/api/assets';
import { AssetListImportConfirmationTokenState } from './AssetListImportConfirmationTokenState/AssetListImportConfirmationTokenState';
import { AssetListSelectTokenState } from './AssetListSelectTokenState/AssetListSelectTokenState';

enum AssetListModalState {
  SELECT_TOKEN,
  IMPORT_TOKEN_CONFIRM,
}

interface TokenListModalProps {
  readonly close: () => void;
  readonly onSelectChanged?: (name: AssetInfo) => void | undefined;
  readonly assets$?: Observable<AssetInfo[]>;
  readonly value?: AssetInfo;
  readonly assetsToImport$?: Observable<AssetInfo[]>;
  readonly importedAssets$?: Observable<AssetInfo[]>;
}

const StyledArrowLeftOutlined = styled(ArrowLeftOutlined)`
  cursor: pointer;
`;

const AssetListModal: React.FC<TokenListModalProps> = ({
  close,
  onSelectChanged,
  assets$,
  assetsToImport$,
  importedAssets$,
  value,
}) => {
  const [assetListModalState, setAssetListModalState] =
    useState<AssetListModalState>(AssetListModalState.SELECT_TOKEN);
  const { valBySize } = useDevice();
  const [assetToImport, setAssetToImport] = useState<AssetInfo | undefined>();

  const handleAssetSelect = (asset: AssetInfo) => {
    if (onSelectChanged) {
      onSelectChanged(asset);
    }

    if (close) {
      close();
    }
  };

  const handleAssetImport = (asset: AssetInfo) => {
    setAssetToImport(asset);
    setAssetListModalState(AssetListModalState.IMPORT_TOKEN_CONFIRM);
  };

  const handleAssetImportConfirm = (
    asset: AssetInfo,
    pairAssets: AssetInfo[],
  ) => {
    importTokenAsset(pairAssets.concat(asset));
    handleAssetSelect(asset);
  };

  const resetModalState = () => {
    setAssetToImport(undefined);
    setAssetListModalState(AssetListModalState.SELECT_TOKEN);
  };

  return (
    <>
      <Modal.Title>
        {assetListModalState === AssetListModalState.SELECT_TOKEN ? (
          <Trans>Select a token</Trans>
        ) : (
          <Flex align="center">
            <Flex.Item marginRight={5}>
              <Typography.Title level={5}>
                <StyledArrowLeftOutlined onClick={resetModalState} />
              </Typography.Title>
            </Flex.Item>
            <Trans>Select a token</Trans>
          </Flex>
        )}
      </Modal.Title>
      <Modal.Content width={valBySize<CSSProperties['width']>('100%', 500)}>
        {assetListModalState === AssetListModalState.SELECT_TOKEN && (
          <AssetListSelectTokenState
            value={value}
            assetsToImport$={assetsToImport$}
            assets$={assets$}
            importedAssets$={importedAssets$}
            onAssetImport={handleAssetImport}
            onAssetSelect={handleAssetSelect}
          />
        )}
        {assetListModalState === AssetListModalState.IMPORT_TOKEN_CONFIRM && (
          <AssetListImportConfirmationTokenState
            onAssetsImportConfirm={handleAssetImportConfirm}
            asset={assetToImport!}
          />
        )}
      </Modal.Content>
    </>
  );
};

export { AssetListModal };

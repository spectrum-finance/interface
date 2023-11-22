import { Form, Modal, useDevice } from '@ergolabs/ui-kit';
import * as React from 'react';
import { Observable } from 'rxjs';

import { AssetInfo } from '../../../../common/models/AssetInfo';
import { CHEVRON_DOWN } from '../../../../utils/images.ts';
import { AssetTitle } from '../../../AssetTitle/AssetTitle';
import { SkeletonLoader } from '../../../SkeletonLoader/SkeletonLoader.tsx';
import { AssetListModal } from './AssetListModal/AssetListModal';
import styles from './AssetSelect.module.less';

interface TokenSelectProps {
  readonly value?: AssetInfo | undefined;
  readonly onChange?: (value: AssetInfo) => void;
  readonly assets$?: Observable<AssetInfo[]>;
  readonly assetsToImport$?: Observable<AssetInfo[]>;
  readonly importedAssets$?: Observable<AssetInfo[]>;
  readonly disabled?: boolean;
  readonly readonly?: boolean;
  readonly loading?: boolean;
}
const AssetSelect: React.FC<TokenSelectProps> = ({
  value,
  onChange,
  disabled,
  readonly,
  assets$,
  assetsToImport$,
  importedAssets$,
  loading,
}) => {
  const { /* s,  */ valBySize } = useDevice();
  const handleSelectChange = (newValue: AssetInfo): void => {
    if (value?.id !== newValue?.id && onChange) {
      onChange(newValue);
    }
  };

  const openTokenModal = () => {
    if (readonly) {
      return;
    }
    Modal.open(({ close }) => (
      <AssetListModal
        assetsToImport$={assetsToImport$}
        assets$={assets$}
        importedAssets$={importedAssets$}
        close={close}
        value={value}
        onSelectChanged={handleSelectChange}
      />
    ));
  };

  return (
    <>
      {loading ? (
        <SkeletonLoader height={40} width={100} />
      ) : (
        <button
          className={styles.btnSelectAsset}
          onClick={openTokenModal}
          disabled={disabled}
        >
          <div className={styles.btnContent}>
            <div className={styles.asset}>
              {value ? (
                <AssetTitle level={valBySize(5, 4)} gap={2} asset={value} />
              ) : (
                <p className={styles.text}>Select a token</p>
              )}
            </div>
            {!readonly && (
              <svg width="14" height="14" className={styles.icon}>
                <use href={CHEVRON_DOWN} />
              </svg>
            )}
          </div>
        </button>
      )}
    </>
  );
};

interface TokeSelectFormItem extends TokenSelectProps {
  name: string;
}

const AssetSelectFormItem: React.FC<TokeSelectFormItem> = ({
  name,
  ...rest
}) => {
  return (
    <Form.Item name={name}>
      {(params) => <AssetSelect {...{ ...rest, ...params }} />}
    </Form.Item>
  );
};

export { AssetSelect, AssetSelectFormItem };

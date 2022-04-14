import { t } from '@lingui/macro';
import React from 'react';

import { Button, Modal, SettingOutlined, Tooltip } from '../../../ergodex-cdk';
import { GlobalSettingsModal } from '../../Header/GlobalSettingsModal/GlobalSettingsModal';

const GlobalSettingsButton = (): JSX.Element => {
  return (
    <Tooltip title={t`Global settings`} placement="bottom">
      <Button
        className="header__btn"
        size="large"
        type="ghost"
        icon={<SettingOutlined />}
        onClick={() =>
          Modal.open(({ close }) => <GlobalSettingsModal onClose={close} />)
        }
      />
    </Tooltip>
  );
};

export { GlobalSettingsButton };

import { Button, EyeInvisibleOutlined, EyeOutlined } from '@ergolabs/ui-kit';
import styled from 'styled-components';

import { useApplicationSettings } from '../../context';

const ToogleButton = styled(Button)`
  border: none !important;
  color: var(--spectrum-primary-text) !important;
  background-color: transparent !important;
`;

export const SensitiveContentToggle = () => {
  const [settings, setSettings] = useApplicationSettings();

  const handleSensitiveContentToggle = () => {
    setSettings({
      ...settings,
      isSensitiveHidden: !settings.isSensitiveHidden,
    });
  };

  return (
    <ToogleButton
      size="small"
      icon={
        settings.isSensitiveHidden ? <EyeOutlined /> : <EyeInvisibleOutlined />
      }
      onClick={(event) => {
        event.stopPropagation();
        handleSensitiveContentToggle();
      }}
    />
  );
};

import { Button, EyeInvisibleOutlined, EyeOutlined } from '@ergolabs/ui-kit';

import { useApplicationSettings } from '../../context';

export const SensitiveContentToggle = () => {
  const [settings, setSettings] = useApplicationSettings();

  const handleSensitiveContentToggle = () => {
    setSettings({
      ...settings,
      isSensitiveHidden: !settings.isSensitiveHidden,
    });
  };

  return (
    <Button
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

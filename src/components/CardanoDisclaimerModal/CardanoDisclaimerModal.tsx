import {
  Box,
  Button,
  Checkbox,
  Flex,
  Modal,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC, useState } from 'react';
import styled from 'styled-components';

import {
  SPECTRUM_DISCORD_LINK,
  SPECTRUM_PRIVACY_POLICY_LINK,
  SPECTRUM_TELEGRAM_LINK,
  SPECTRUM_TERMS_OF_SERVICE_LINK,
} from '../../common/constants/url.ts';
import { Settings, useApplicationSettings } from '../../context';

const List = styled.ul`
  margin: 0;
  padding-left: calc(var(--spectrum-base-gutter) * 4);
`;
interface DisclaimerModalProps {
  close: () => void;
}
const CardanoDisclaimerModal: FC<DisclaimerModalProps> = ({ close }) => {
  const [settings, setSettings] = useApplicationSettings();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleStartTrading = () => {
    close();
    setSettings({
      ...settings,
      isCardanoDisclaimerModalConfirmed: true,
    });
  };

  return (
    <>
      <Modal.Title>
        <Trans>Disclaimer</Trans>
      </Modal.Title>
      <Modal.Content width={556}>
        <Flex col>
          <Flex.Item marginBottom={2}>
            <Box padding={[3, 4]} borderRadius="m">
              <List>
                <li>
                  <Trans>
                    Spectrum Finance Carano AMM is a decentralized contract
                    protocol aka DEX. The order execution is handled by
                    execution bots operators (or off-chain batchers). Anyone can
                    run batchers on their machine.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    If you encounter any bugs, please contact us via{' '}
                    <Typography.Link
                      href={SPECTRUM_DISCORD_LINK}
                      target="_blank"
                    >
                      {' '}
                      Discord
                    </Typography.Link>{' '}
                    or
                    <Typography.Link
                      href={SPECTRUM_TELEGRAM_LINK}
                      target="_blank"
                    >
                      Telegram
                    </Typography.Link>{' '}
                    channels.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    This is <b>BETA</b> Software — use at your own risk.
                  </Trans>
                </li>
              </List>
            </Box>
          </Flex.Item>
          <Flex.Item marginBottom={2}>
            <Checkbox onChange={() => setIsChecked((prev) => !prev)}>
              <Trans>
                I have read and agreed to{' '}
                <Typography.Link
                  href={SPECTRUM_TERMS_OF_SERVICE_LINK}
                  target="_blank"
                >
                  Terms of Service
                </Typography.Link>{' '}
                and{' '}
                <Typography.Link
                  href={SPECTRUM_PRIVACY_POLICY_LINK}
                  target="_blank"
                >
                  Privacy Policy
                </Typography.Link>
                .
              </Trans>
            </Checkbox>
          </Flex.Item>
          <Button
            size="large"
            type="primary"
            onClick={handleStartTrading}
            disabled={!isChecked}
          >
            <Trans>Start Trading</Trans>
          </Button>
        </Flex>
      </Modal.Content>
    </>
  );
};

export const showCardanoDisclaimerModal = (settings: Settings) => {
  if (settings.isCardanoDisclaimerModalConfirmed) {
    return;
  }
  setTimeout(() => {
    Modal.open(({ close }) => <CardanoDisclaimerModal close={close} />, {
      closable: false,
    });
  }, 2000);
};

import {
  Button,
  DownOutlined,
  Dropdown,
  Flex,
  LoadingOutlined,
  Menu,
  Modal,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { useEffect, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { defer, switchMap } from 'rxjs';

import { useObservable } from '../../common/hooks/useObservable';
import { Currency } from '../../common/models/Currency';
import { localStorageManager } from '../../common/utils/localStorageManager';
import {
  availableAssets$,
  requestTestnetAsset,
} from '../../network/cardano/api/faucet/faucet';
import { AssetIcon } from '../AssetIcon/AssetIcon';

interface FaucetModalProps {
  close: (result?: boolean) => void;
}

export const FAUCET_KEY = 'ergodex-faucet-key';

const FaucetModal: React.FC<FaucetModalProps> = ({ close }) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [availableAssets] = useObservable(availableAssets$);
  const [activeAsset, setActiveAsset] = useState<Currency>();
  const { executeRecaptcha } = useGoogleReCaptcha();
  useEffect(() => {
    if (availableAssets) {
      setActiveAsset(availableAssets[0]);
    }
  }, [availableAssets]);

  const getTokens = () => {
    if (activeAsset && executeRecaptcha) {
      setSubmitting(true);

      defer(() => executeRecaptcha())
        .pipe(
          switchMap((recaptchaToken) =>
            requestTestnetAsset(activeAsset.asset, recaptchaToken),
          ),
        )
        .subscribe(
          () => {
            localStorageManager.set(FAUCET_KEY, true);
            setSubmitting(false);
            close(true);
          },
          () => setSubmitting(false),
        );
    }
  };

  return (
    <>
      <Modal.Title>
        <Trans>Get testnet tokens</Trans>
      </Modal.Title>
      <Modal.Content width={470}>
        <Flex col>
          <Flex.Item marginBottom={2}>
            <Typography.Body>
              <Trans>
                To get testnet ADA coins (tADA) go to the official{' '}
                <Typography.Link
                  href="https://testnets.cardano.org/en/testnets/cardano/tools/faucet/"
                  target="_black"
                >
                  Cardano Faucet
                </Typography.Link>
              </Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item marginBottom={2}>
            <Typography.Body>
              <Trans>
                To get ErgoDEX testnet tokens select a token that you want to
                receive and press &quot;Get testnet token&quot; button
              </Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <Dropdown
              overlay={
                <Menu>
                  {availableAssets?.map((currency: Currency, i: number) => {
                    return (
                      <Menu.Item
                        key={i}
                        onClick={() => setActiveAsset(currency)}
                      >
                        <Flex>
                          <Flex.Item marginRight={2}>
                            <AssetIcon asset={currency.asset} />
                          </Flex.Item>
                          <Flex.Item flex={1}>
                            {currency.asset.name}: {currency.toString()}
                          </Flex.Item>
                        </Flex>
                      </Menu.Item>
                    );
                  })}
                </Menu>
              }
              trigger={availableAssets ? ['click'] : []}
            >
              <Button
                size="large"
                block
                style={{ padding: '0 12px', textAlign: 'left' }}
                disabled
              >
                <Flex justify="space-between">
                  <Flex.Item marginRight={2} grow flex={1} display="flex">
                    {activeAsset ? (
                      <>
                        <Flex.Item marginRight={2}>
                          <AssetIcon asset={activeAsset.asset} />
                        </Flex.Item>
                        <Flex.Item flex={1}>
                          {activeAsset.asset.name}: {activeAsset.toString()}
                        </Flex.Item>
                      </>
                    ) : (
                      <LoadingOutlined />
                    )}
                  </Flex.Item>
                  <Flex.Item>
                    <Flex align="center" style={{ height: '100%' }}>
                      <DownOutlined />
                    </Flex>
                  </Flex.Item>
                </Flex>
              </Button>
            </Dropdown>
          </Flex.Item>
          <Flex.Item>
            <Button
              loading={submitting}
              onClick={getTokens}
              type="primary"
              block
              size="extra-large"
            >
              <Trans>Get testnet token</Trans>
            </Button>
          </Flex.Item>
        </Flex>
      </Modal.Content>
    </>
  );
};

export { FaucetModal };

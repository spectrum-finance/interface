import { Trans } from '@lingui/macro';
import { evaluate } from 'mathjs';
import React, { useEffect, useState } from 'react';

import { useObservable } from '../../common/hooks/useObservable';
import { localStorageManager } from '../../common/utils/localStorageManager';
import {
  Button,
  DownOutlined,
  Dropdown,
  Flex,
  Menu,
  Modal,
  Typography,
} from '../../ergodex-cdk';
import {
  getAvailableTestnetTokensList,
  getTestnetTokens,
} from '../../network/cardano/api/faucet/faucet';

interface FaucetModalProps {
  close: (result?: boolean) => void;
}

interface TestToken {
  dripAmount: number;
  dripAsset: {
    unAssetClass: [{ unCurrencySymbol: string }, { unTokenName: string }];
  };
}

const convertAmount = (a: number) => `${evaluate(`${a} / 1000000`)}.00`;

export const FAUCET_KEY = 'ergodex-faucet-key';

const FaucetModal: React.FC<FaucetModalProps> = ({ close }) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [availableTestnetTokens] = useObservable(
    getAvailableTestnetTokensList(),
    [],
  );
  const [activeToken, setActiveToken] = useState<TestToken>();

  useEffect(() => {
    if (availableTestnetTokens) {
      setActiveToken(availableTestnetTokens[0]);
    }
  }, [availableTestnetTokens]);

  const getTokens = () => {
    if (activeToken) {
      setSubmitting(true);
      getTestnetTokens(
        `${activeToken.dripAsset.unAssetClass[0].unCurrencySymbol}.${activeToken.dripAsset.unAssetClass[1].unTokenName}`,
      ).subscribe(
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
          <Flex.Item marginBottom={2}>
            {availableTestnetTokens && activeToken && (
              <Dropdown
                overlay={
                  <Menu>
                    {availableTestnetTokens.map(
                      (token: TestToken, i: number) => {
                        return (
                          <Menu.Item
                            key={i}
                            onClick={() => setActiveToken(token)}
                          >
                            {`${
                              token.dripAsset.unAssetClass[1].unTokenName
                            }: ${convertAmount(token.dripAmount)}`}
                          </Menu.Item>
                        );
                      },
                    )}
                  </Menu>
                }
                trigger={['click']}
              >
                <Button
                  size="large"
                  block
                  style={{ padding: '0 12px', textAlign: 'left' }}
                  disabled
                >
                  <Flex justify="space-between">
                    <Flex.Item marginRight={2} grow>
                      {`${
                        activeToken.dripAsset.unAssetClass[1].unTokenName
                      }: ${convertAmount(activeToken.dripAmount)}`}
                    </Flex.Item>
                    <Flex.Item>
                      <Flex align="center" style={{ height: '100%' }}>
                        <DownOutlined />
                      </Flex>
                    </Flex.Item>
                  </Flex>
                </Button>
              </Dropdown>
            )}
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

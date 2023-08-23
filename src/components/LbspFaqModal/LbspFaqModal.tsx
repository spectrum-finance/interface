import { Collapse, Flex, Modal, Typography, useDevice } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC, ReactNode, useMemo } from 'react';
import styled from 'styled-components';

const MODAL_WIDTH = 556;

interface FaqProps {
  children: ReactNode | string;
  question: string;
  className?: string;
  key: React.Key;
}

const _Faq: FC<FaqProps> = ({ children, question, key, className }) => {
  return (
    <Collapse className={className}>
      <Collapse.Panel header={question} key={key}>
        {children}
      </Collapse.Panel>
    </Collapse>
  );
};

const Faq = styled(_Faq)`
  .ant-collapse-header {
    color: var(--spectrum-primary-text) !important;
    font-weight: 700;
  }
  .ant-collapse-content {
    color: var(--spectrum-primary-text) !important;
    max-width: ${MODAL_WIDTH - 32}px;
  }
`;

export const LbspFaqModal = () => {
  const { s } = useDevice();
  const questions = useMemo(
    () => [
      {
        question: t`What is Liquidity Bootstrapping Stake Pool (LBSP)?`,
        content: t`The Liquidity Bootstrapping Stake Pool (LBSP) is an incentive program for liquidity providers, rewarding them with SPF utility tokens in exchange for providing liquidity.`,
      },
      {
        question: t`What is the reward for participation?`,
        content: t`The reward for participation is SPF utility token. The LBSP program is the largest SPF token distribution event.`,
      },
      {
        question: t`What’s the utility of the SPF token?`,
        content: t`SPF is a cross-chain token whose main utility is to secure Spectrum Network PoS consensus. Spectrum Network is a trustless cross-chain messaging protocol that is currently in an active development stage. However, while Spectrum Network is under development, users can pay execution fees using the SPF on Layer 1 AMM protocols by Spectrum Finance.`,
      },
      {
        question: t`How do I participate in the LBSP program?`,
        content: t`To participate in the program you need to provide liquidity to any LBSP-labeled liquidity pool using this interface.`,
      },
      {
        question: t`Why do I participate in the LBSP program?`,
        content: t`The LBSP program is the most important step in SPF token distribution which opens the opportunity for the community to obtain a large portion of the supply. In the future, the only way to get the token will be staking on the PoS consensus of the Spectrum Network cross-chain messaging protocol.`,
      },
      {
        question: t`How does the reward mechanism work for the LBSP program?`,
        content: (
          <>
            <Typography.Paragraph>
              <Trans>
                The base reward per epoch is 0.006 SPF per delegated ADA. This
                reward can be obtained via delegating ADA to the standard ISPO —
              </Trans>
              <Typography.Link
                href="https://cardanoscan.io/pool/27eba5dbeb2b52f5613aa452cf54cab7f9894538d6efb7d271ccc36f"
                target="_blank"
              >
                <Trans>SPF0</Trans>
              </Typography.Link>
              .{' '}
              <Trans>
                You can find it in any wallet app and delegate your ADA.
              </Trans>
            </Typography.Paragraph>
            <Typography.Paragraph>
              <Trans>
                However, two multipliers are introduced for those who provide
                liquidity to the protocol:
              </Trans>
            </Typography.Paragraph>
            <Trans>
              (1) The 2.25 multiplier applies to all delegated ADA that was
              provided as liquidity to the LBSP-labeled liquidity pools. Epoch
              reward is 0.006 * 2.25 = 0.0135 SPF per delegated ADA.
            </Trans>
            <Typography.Paragraph />
            <Typography.Paragraph>
              <Trans>
                (2) The 3.5 multiplier applies to all delegated ADA that was
                provided to the ADA/SPF liquidity pool, which is available for
                liquidity provision from epoch 438. Epoch reward is 0.006 * 3.5
                = 0.021 SPF per delegated ADA.
              </Trans>
            </Typography.Paragraph>
          </>
        ),
      },
      {
        question: t`Are there any risks involved?`,
        content: (
          <>
            <Typography.Paragraph>
              <Trans>
                <b>(1) Impermanent Loss:</b> This risk arises due to the price
                volatility of the pooled assets. If the prices of the tokens in
                the liquidity pool change significantly while providing
                liquidity, it can result in a loss compared to simply holding
                the tokens.
              </Trans>
            </Typography.Paragraph>
            <Typography.Paragraph>
              <Trans>
                <b>(2) Smart Contract Risks:</b> AMM protocols are powered by
                smart contracts, which are not immune to bugs or
                vulnerabilities. If there&apos;s a flaw in the protocol&apos;s
                code, it can lead to funds being lost or mismanaged.
              </Trans>
            </Typography.Paragraph>
            <Typography.Paragraph>
              <Trans>
                <b>(3) Market Manipulation:</b> Liquidity providers may face the
                risk of market manipulation, especially in smaller and less
                liquid markets. This could result in sudden and sharp price
                fluctuations that impact the value of the provided liquidity.
              </Trans>
            </Typography.Paragraph>
            <Typography.Paragraph>
              <Trans>
                Always do your own research before interacting with any DeFi
                protocol in the space.
              </Trans>
            </Typography.Paragraph>
          </>
        ),
      },
      {
        question: t`How does the LBSP program work technically?`,
        content: t`Cardano PoS blockchain makes it possible to delegate and stake ADA not only using a wallet but also from a smart contract. All Spectrum Finance Pool smart contracts that represent liquidity pools in the system delegate ADA to Liquidity Bootstrapping Stake Pools. These stake pools generate blocks and ADA rewards for the project’s treasury and for ADA/SPF liquidity pool. In exchange, liquidity providers are rewarded with SPF utility tokens.`,
      },
    ],
    [],
  );

  return (
    <>
      <Modal.Title>LBSP FAQ</Modal.Title>
      <Modal.Content
        width={MODAL_WIDTH}
        style={{
          height: s ? '590px' : 'auto',
          maxHeight: s ? 'auto' : '70vh',
          overflow: 'auto',
        }}
      >
        <Flex col>
          {questions.map(({ question, content }, index) => {
            return (
              <Flex.Item marginBottom={2} key={`faq-question-${index}`}>
                <Faq key={`faq-${index}`} question={question}>
                  {content}
                </Faq>
              </Flex.Item>
            );
          })}
          <Flex.Item>
            Read{' '}
            <Typography.Link
              target="_blank"
              href="https://medium.com/@spectrumlabs/lbsp-a-novel-ispo-mechanism-for-bootstrapping-liquidity-7fb461b4b849"
            >
              this article
            </Typography.Link>{' '}
            to know everything about the LBSP program.
          </Flex.Item>
        </Flex>
      </Modal.Content>
    </>
  );
};

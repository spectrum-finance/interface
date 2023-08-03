import { Button, Flex, Modal } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

import { useAdaHandle, useAdaHandleBalance } from '../../../api/adaHandle';
import { ReactComponent as AdaHandleIcon } from '../ada-handle-icon.svg';

interface AdaHandleModalProps {
  close: () => void;
  withSkip?: boolean;
}
export const AdaHandleModal: FC<AdaHandleModalProps> = ({
  close,
  withSkip,
}) => {
  const [adaHandlesList] = useAdaHandleBalance();
  const [activeHandle, setActiveHandle] = useAdaHandle();

  return (
    <>
      <Modal.Title>Select ADA Handle</Modal.Title>
      <Modal.Content width={300}>
        <Flex col align="center">
          {adaHandlesList.map(({ id, name }) => {
            return (
              <Flex.Item key={id} marginBottom={2} width="100%">
                <Button
                  size="large"
                  block
                  disabled={activeHandle && activeHandle.id === id}
                  onClick={() => {
                    setActiveHandle({ id, name });
                    close();
                  }}
                >
                  <Flex align="center">
                    <AdaHandleIcon />
                    <Flex.Item marginLeft={2}>{name}</Flex.Item>
                  </Flex>
                </Button>
              </Flex.Item>
            );
          })}
          {withSkip ? (
            <Flex.Item>
              <Button type="link" onClick={close}>
                <Trans>Skip</Trans>
              </Button>
            </Flex.Item>
          ) : (
            <Flex.Item>
              <Button
                type="link"
                onClick={() => {
                  setActiveHandle(undefined);
                  close();
                }}
              >
                <Trans>Reset</Trans>
              </Button>
            </Flex.Item>
          )}
        </Flex>
      </Modal.Content>
    </>
  );
};

export const openAdaHandleModal = (withSkip?: boolean) => {
  Modal.open(({ close }) => (
    <AdaHandleModal close={close} withSkip={withSkip} />
  ));
};

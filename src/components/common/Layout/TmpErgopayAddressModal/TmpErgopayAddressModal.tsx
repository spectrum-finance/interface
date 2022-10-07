import React, { Button, Flex, Input, Modal } from '@ergolabs/ui-kit';
import { FC, useState } from 'react';

import { localStorageManager } from '../../../../common/utils/localStorageManager';
import { lsKey } from '../../../../network/ergo/api/wallet/readonly/readonly';

export const TmpErgopayAddressModal: FC<{ close: () => void }> = ({
  close,
}) => {
  const [address, setAddress] = useState<string>();

  return (
    <>
      <Modal.Title>ErgoPay address</Modal.Title>
      <Modal.Content width={400}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            localStorageManager.set(lsKey, address);
            close();
          }}
        >
          <Flex col>
            <Flex.Item marginBottom={2}>Please, enter wallet address</Flex.Item>
            <Flex.Item marginBottom={4}>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Flex.Item>
            <Button size="extra-large" htmlType="submit">
              Save
            </Button>
          </Flex>
        </form>
      </Modal.Content>
    </>
  );
};

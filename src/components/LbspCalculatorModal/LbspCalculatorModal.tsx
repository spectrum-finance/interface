import { Button, Flex, Modal } from '@ergolabs/ui-kit';
import { FC } from 'react';

interface LbspCalculatorModalProps {
  close: () => void;
}

export const LbspCalculatorModal: FC<LbspCalculatorModalProps> = ({
  close,
}) => {
  return (
    <>
      <Modal.Title>Hello</Modal.Title>
      <Modal.Content width={480}>
        <Flex col>
          <Flex.Item marginBottom={2}>Hello</Flex.Item>
          <Button
            size="extra-large"
            type="primary"
            block
            onClick={() => {
              console.log('Hello');
              close();
            }}
          >
            Provide Liquidity
          </Button>
        </Flex>
      </Modal.Content>
    </>
  );
};

import { Meta, Story } from '@storybook/react';
import { Form } from 'antd';
import React, { FC } from 'react';

import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Row } from '../Row/Row';
import { Typography } from '../Typography/Typography';
import { Modal } from './Modal';

export default {
  title: 'Components/Modal',
  component: Modal as any,
} as Meta<any>;

const CustomModal: FC<{ close?: (result: boolean) => void }> = ({ close }) => (
  <Form layout="vertical">
    <Form.Item label="Login">
      <Input />
    </Form.Item>
    <Form.Item label="Password">
      <Input />
    </Form.Item>
    <Button
      htmlType="submit"
      type="primary"
      style={{ width: '100%' }}
      onClick={() => close && close(true)}
    >
      Submit
    </Button>
  </Form>
);

const ActionModalContent: FC<{ next: (request: Promise<any>) => void }> = ({
  next,
}) => {
  const onSubmit = () =>
    next(new Promise((resolve) => setTimeout(resolve, 5000)));

  return (
    <Form layout="vertical">
      <Form.Item label="Login">
        <Input />
      </Form.Item>
      <Form.Item label="Password">
        <Input />
      </Form.Item>
      <Button
        htmlType="submit"
        type="primary"
        style={{ width: '100%' }}
        onClick={onSubmit}
      >
        Submit
      </Button>
    </Form>
  );
};

const ProgressModalContent = () => (
  <>
    <Row justify="center" bottomGutter={1}>
      <Typography.Title level={4}>Waiting for confirmation</Typography.Title>
    </Row>
    <Row justify="center" bottomGutter={1}>
      <Typography.Text>Removing 0.01 ERG for 31.0068USDT</Typography.Text>
    </Row>
    <Row justify="center" bottomGutter={1}>
      <Typography.Text type="secondary">
        Confirm this transaction in your wallet
      </Typography.Text>
    </Row>
  </>
);

const ErrorModalContent = () => (
  <>
    <Row justify="center" gutter={0.5}>
      <Typography.Title level={4}>Error</Typography.Title>
    </Row>
    <Row justify="center" gutter={0.5}>
      <Typography.Text>Removing 0.01 ERG for 31.0068USDT</Typography.Text>
    </Row>
    <Row justify="center" gutter={0.5}>
      <Typography.Text type="secondary">Trunsuction rejected</Typography.Text>
    </Row>
    <Row justify="center" gutter={0.5}>
      <Typography.Text type="secondary">Try again later</Typography.Text>
    </Row>
  </>
);

const WarningModalContent = () => (
  <>
    <Row justify="center" gutter={0.5}>
      <Typography.Title level={4}>Warning</Typography.Title>
    </Row>
    <Row justify="center" gutter={0.5}>
      <Typography.Text>Removing 0.01 ERG for 31.0068USDT</Typography.Text>
    </Row>
    <Row justify="center" gutter={0.5}>
      <Typography.Text type="secondary">Trunsuction rejected</Typography.Text>
    </Row>
    <Row justify="center" gutter={0.5}>
      <Typography.Text type="secondary">Try again later</Typography.Text>
    </Row>
  </>
);

const SuccessModalContent = () => (
  <>
    <Row justify="center" gutter={0.5}>
      <Typography.Title level={4}>Transaction submitted</Typography.Title>
    </Row>
    <Row justify="center" gutter={0.5}>
      <Typography.Link>View on Explorer</Typography.Link>
    </Row>
  </>
);

export const Default: Story = () => {
  const openCustomModal = () => {
    Modal.open(<CustomModal />);
  };

  const openProgressModal = () => {
    Modal.progress(<ProgressModalContent />);
  };

  const openErrorModal = () => {
    Modal.error(<ErrorModalContent />);
  };

  const openWarningModal = () => {
    Modal.warning(<WarningModalContent />);
  };

  const openSuccessModal = () => {
    Modal.success(<SuccessModalContent />);
  };

  const openRequestModal = () => {
    Modal.request({
      actionContent: (next) => <ActionModalContent next={next} />,
      timeoutContent: <ErrorModalContent />,
      progressContent: <ProgressModalContent />,
      successContent: <SuccessModalContent />,
      errorContent: <ErrorModalContent />,
    });
  };

  return (
    <>
      <h1>Modal</h1>
      <h3>Custom Modal</h3>
      <Button onClick={openCustomModal}>Open Custom Modal</Button>

      <h3>Progress Modal</h3>
      <Button onClick={openProgressModal}>Open Progress Modal</Button>

      <h3>Error Modal</h3>
      <Button onClick={openErrorModal}>Open Error Modal</Button>

      <h3>Warning Modal</h3>
      <Button onClick={openWarningModal}>Open Warning Modal</Button>

      <h3>Success Modal</h3>
      <Button onClick={openSuccessModal}>Open Success Modal</Button>

      <h3>Request Modal</h3>
      <Button onClick={openRequestModal}>Open Request Modal</Button>
    </>
  );
};

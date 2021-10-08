import './Alert.stories.css';

import { Meta, Story } from '@storybook/react';
import { Col, Row } from 'antd';
import React from 'react';

import { CustomAlert as Alert, CustomAlertProps as AlertProps } from './Alert';

export default {
  title: 'Components/Alert',
  component: Alert,
} as Meta<typeof Alert>;

const MiniTemplate = (args: AlertProps) => (
  <>
    <Col span={8}>
      <Alert {...args} />
    </Col>
    <Col span={8}>
      <Alert {...args} closable />
    </Col>
    <Col span={8}>
      <Alert {...args} closeText="Close now" />
    </Col>
  </>
);

const TemplateByIconDesc = (args: AlertProps) => (
  <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 16]}>
    <MiniTemplate {...args} />
    <MiniTemplate {...args} showIcon />
    <MiniTemplate
      {...args}
      description="Interactively monetize corporate alignments and fully tested niche markets."
    />
    <MiniTemplate
      {...args}
      description="Interactively monetize corporate alignments and fully tested niche markets."
      showIcon
    />
  </Row>
);

const TemplateByBorder = (args: AlertProps) => (
  <>
    <Col span={24}>
      <TemplateByIconDesc {...args} />
    </Col>
    <Col span={24}>
      <TemplateByIconDesc {...args} noBorder />
    </Col>
  </>
);

export const Template: Story = () => (
  <div className="alert-template-board">
    <h1>Alert</h1>
    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 32]}>
      <TemplateByBorder message="Alert title" type="info" />
      <TemplateByBorder message="Alert title" type="success" />
      <TemplateByBorder message="Alert title" type="warning" />
      <TemplateByBorder message="Alert title" type="error" />
    </Row>
  </div>
);

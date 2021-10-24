import './Typography.stories.less';

import { Meta, Story } from '@storybook/react';
import React, { FC } from 'react';

import { Col, Row } from '../index';
import { Typography } from './Typography';

export default {
  title: 'Components/Typography',
  component: Typography,
} as Meta<typeof Typography>;

const TitleTemplate: FC<{ level: 1 | 2 | 3 | 4 | 5 | undefined }> = ({
  level,
}) => (
  <Row align="middle">
    <Col span={2}>
      <Typography.Body>Level {level}</Typography.Body>
    </Col>
    <Col span={22}>
      <Typography.Title level={level}>
        The face of the moon was in shadow.
      </Typography.Title>
    </Col>
  </Row>
);

export const Title: Story = () => (
  <>
    <h1>Title</h1>
    <TitleTemplate level={1} />
    <TitleTemplate level={2} />
    <TitleTemplate level={3} />
    <TitleTemplate level={4} />
    <TitleTemplate level={5} />
  </>
);
Title.storyName = 'Title';

export const Text: Story = () => (
  <>
    <h1>Text</h1>
    <Row align="middle">
      <Col span={4}>
        <Typography.Body>Body - Regular</Typography.Body>
      </Col>
      <Col span={20}>
        <Typography.Body>The face of the moon was in shadow.</Typography.Body>
      </Col>
    </Row>
    <Row align="middle">
      <Col span={4}>
        <Typography.Text>Body - Semibold</Typography.Text>
      </Col>
      <Col span={20}>
        <Typography.Body strong>
          The face of the moon was in shadow.
        </Typography.Body>
      </Col>
    </Row>
    <Row align="middle">
      <Col span={4}>
        <Typography.Body>Footnote</Typography.Body>
      </Col>
      <Col span={20}>
        <Typography.Footnote>
          The face of the moon was in shadow.
        </Typography.Footnote>
      </Col>
    </Row>
    <Row align="middle">
      <Col span={4}>
        <Typography.Body>Paragraph</Typography.Body>
      </Col>
      <Col span={20}>
        <Typography.Paragraph>
          The face of the moon was in shadow.
        </Typography.Paragraph>
      </Col>
    </Row>
  </>
);
Title.storyName = 'Text';

import './Input.stories.scss';

import { Meta, Story } from '@storybook/react';
import { Col, Form, Row } from 'antd';
import React from 'react';

import { SearchOutlined, UserOutlined } from '../Icon/Icon';
import { Input } from './Input';

export default {
  title: 'Components/Input',
  component: Input,
} as Meta<typeof Input>;

export const Basic: Story = () => (
  <div className="basic-board">
    <h1>Input / Basic</h1>
    <Row gutter={[{ xs: 10, sm: 20, md: 25 }, 5]}>
      <Col className="board-col" span={4}>
        <Input placeholder="Input placeholder" size="large" />
        <Input placeholder="Input placeholder" size="middle" />
        <Input placeholder="Input placeholder" size="small" />
      </Col>
      <Col className="board-col" span={4}>
        <Input
          placeholder="Input placeholder"
          size="large"
          prefix={<SearchOutlined />}
        />
        <Input
          placeholder="Input placeholder"
          size="middle"
          prefix={<SearchOutlined />}
        />
        <Input
          placeholder="Input placeholder"
          size="small"
          prefix={<SearchOutlined />}
        />
      </Col>
      <Col className="board-col" span={4}>
        <Input
          placeholder="Input placeholder"
          size="large"
          suffix={<UserOutlined />}
        />
        <Input
          placeholder="Input placeholder"
          size="middle"
          suffix={<UserOutlined />}
        />
        <Input
          placeholder="Input placeholder"
          size="small"
          suffix={<UserOutlined />}
        />
      </Col>
      <Col className="board-col" span={4}>
        <Input
          placeholder="Input placeholder"
          size="large"
          prefix={<SearchOutlined />}
          suffix={<UserOutlined />}
        />
        <Input
          placeholder="Input placeholder"
          size="middle"
          prefix={<SearchOutlined />}
          suffix={<UserOutlined />}
        />
        <Input
          placeholder="Input placeholder"
          size="small"
          prefix={<SearchOutlined />}
          suffix={<UserOutlined />}
        />
      </Col>
      <Col className="board-col" span={4}>
        <Input
          placeholder="Input placeholder"
          size="large"
          prefix={<span>Prefix</span>}
          suffix={<span>Suffix</span>}
        />
        <Input
          placeholder="Input placeholder"
          size="middle"
          prefix={<span>Prefix</span>}
          suffix={<span>Suffix</span>}
        />
        <Input
          placeholder="Input placeholder"
          size="small"
          prefix={<span>Prefix</span>}
          suffix={<span>Suffix</span>}
        />
      </Col>
    </Row>
    <Row gutter={[{ xs: 10, sm: 20, md: 25 }, 5]}>
      <Col className="board-col" span={4}>
        <Input placeholder="Input placeholder" size="large" disabled />
        <Input placeholder="Input placeholder" size="middle" disabled />
        <Input placeholder="Input placeholder" size="small" disabled />
      </Col>
      <Col className="board-col" span={4}>
        <Input
          placeholder="Input placeholder"
          size="large"
          prefix={<SearchOutlined />}
          disabled
        />
        <Input
          placeholder="Input placeholder"
          size="middle"
          prefix={<SearchOutlined />}
          disabled
        />
        <Input
          placeholder="Input placeholder"
          size="small"
          prefix={<SearchOutlined />}
          disabled
        />
      </Col>
      <Col className="board-col" span={4}>
        <Input
          placeholder="Input placeholder"
          size="large"
          suffix={<UserOutlined />}
          disabled
        />
        <Input
          placeholder="Input placeholder"
          size="middle"
          suffix={<UserOutlined />}
          disabled
        />
        <Input
          placeholder="Input placeholder"
          size="small"
          suffix={<UserOutlined />}
          disabled
        />
      </Col>
      <Col className="board-col" span={4}>
        <Input
          placeholder="Input placeholder"
          size="large"
          prefix={<SearchOutlined />}
          suffix={<UserOutlined />}
          disabled
        />
        <Input
          placeholder="Input placeholder"
          size="middle"
          prefix={<SearchOutlined />}
          suffix={<UserOutlined />}
          disabled
        />
        <Input
          placeholder="Input placeholder"
          size="small"
          prefix={<SearchOutlined />}
          suffix={<UserOutlined />}
          disabled
        />
      </Col>
      <Col className="board-col" span={4}>
        <Input
          placeholder="Input placeholder"
          size="large"
          prefix={<span>Prefix</span>}
          suffix={<span>Suffix</span>}
          disabled
        />
        <Input
          placeholder="Input placeholder"
          size="middle"
          prefix={<span>Prefix</span>}
          suffix={<span>Suffix</span>}
          disabled
        />
        <Input
          placeholder="Input placeholder"
          size="small"
          prefix={<span>Prefix</span>}
          suffix={<span>Suffix</span>}
          disabled
        />
      </Col>
    </Row>
    <Row gutter={[{ xs: 10, sm: 20, md: 25 }, 5]}>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="error">
          <Input placeholder="Input placeholder" size="large" />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input placeholder="Input placeholder" size="middle" />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input placeholder="Input placeholder" size="small" />
        </Form.Item>
      </Col>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="large"
            prefix={<SearchOutlined />}
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="middle"
            prefix={<SearchOutlined />}
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="small"
            prefix={<SearchOutlined />}
          />
        </Form.Item>
      </Col>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="large"
            suffix={<UserOutlined />}
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="middle"
            suffix={<UserOutlined />}
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="small"
            suffix={<UserOutlined />}
          />
        </Form.Item>
      </Col>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="large"
            prefix={<SearchOutlined />}
            suffix={<UserOutlined />}
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="middle"
            prefix={<SearchOutlined />}
            suffix={<UserOutlined />}
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="small"
            prefix={<SearchOutlined />}
            suffix={<UserOutlined />}
          />
        </Form.Item>
      </Col>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="large"
            prefix={<span>Prefix</span>}
            suffix={<span>Suffix</span>}
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="middle"
            prefix={<span>Prefix</span>}
            suffix={<span>Suffix</span>}
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="small"
            prefix={<span>Prefix</span>}
            suffix={<span>Suffix</span>}
          />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={[{ xs: 10, sm: 20, md: 25 }, 5]}>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="error">
          <Input placeholder="Input placeholder" size="large" disabled />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input placeholder="Input placeholder" size="middle" disabled />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input placeholder="Input placeholder" size="small" disabled />
        </Form.Item>
      </Col>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="large"
            prefix={<SearchOutlined />}
            disabled
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="middle"
            prefix={<SearchOutlined />}
            disabled
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="small"
            prefix={<SearchOutlined />}
            disabled
          />
        </Form.Item>
      </Col>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="large"
            suffix={<UserOutlined />}
            disabled
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="middle"
            suffix={<UserOutlined />}
            disabled
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="small"
            suffix={<UserOutlined />}
            disabled
          />
        </Form.Item>
      </Col>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="large"
            prefix={<SearchOutlined />}
            suffix={<UserOutlined />}
            disabled
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="middle"
            prefix={<SearchOutlined />}
            suffix={<UserOutlined />}
            disabled
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="small"
            prefix={<SearchOutlined />}
            suffix={<UserOutlined />}
            disabled
          />
        </Form.Item>
      </Col>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="large"
            prefix={<span>Prefix</span>}
            suffix={<span>Suffix</span>}
            disabled
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="middle"
            prefix={<span>Prefix</span>}
            suffix={<span>Suffix</span>}
            disabled
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="error">
          <Input
            placeholder="Input placeholder"
            size="small"
            prefix={<span>Prefix</span>}
            suffix={<span>Suffix</span>}
            disabled
          />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={[{ xs: 10, sm: 20, md: 25 }, 5]}>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="warning">
          <Input placeholder="Input placeholder" size="large" />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input placeholder="Input placeholder" size="middle" />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input placeholder="Input placeholder" size="small" />
        </Form.Item>
      </Col>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="large"
            prefix={<SearchOutlined />}
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="middle"
            prefix={<SearchOutlined />}
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="small"
            prefix={<SearchOutlined />}
          />
        </Form.Item>
      </Col>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="large"
            suffix={<UserOutlined />}
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="middle"
            suffix={<UserOutlined />}
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="small"
            suffix={<UserOutlined />}
          />
        </Form.Item>
      </Col>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="large"
            prefix={<SearchOutlined />}
            suffix={<UserOutlined />}
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="middle"
            prefix={<SearchOutlined />}
            suffix={<UserOutlined />}
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="small"
            prefix={<SearchOutlined />}
            suffix={<UserOutlined />}
          />
        </Form.Item>
      </Col>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="large"
            prefix={<span>Prefix</span>}
            suffix={<span>Suffix</span>}
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="middle"
            prefix={<span>Prefix</span>}
            suffix={<span>Suffix</span>}
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="small"
            prefix={<span>Prefix</span>}
            suffix={<span>Suffix</span>}
          />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={[{ xs: 10, sm: 20, md: 25 }, 5]}>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="warning">
          <Input placeholder="Input placeholder" size="large" disabled />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input placeholder="Input placeholder" size="middle" disabled />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input placeholder="Input placeholder" size="small" disabled />
        </Form.Item>
      </Col>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="large"
            prefix={<SearchOutlined />}
            disabled
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="middle"
            prefix={<SearchOutlined />}
            disabled
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="small"
            prefix={<SearchOutlined />}
            disabled
          />
        </Form.Item>
      </Col>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="large"
            suffix={<UserOutlined />}
            disabled
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="middle"
            suffix={<UserOutlined />}
            disabled
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="small"
            suffix={<UserOutlined />}
            disabled
          />
        </Form.Item>
      </Col>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="large"
            prefix={<SearchOutlined />}
            suffix={<UserOutlined />}
            disabled
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="middle"
            prefix={<SearchOutlined />}
            suffix={<UserOutlined />}
            disabled
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="small"
            prefix={<SearchOutlined />}
            suffix={<UserOutlined />}
            disabled
          />
        </Form.Item>
      </Col>
      <Col className="board-col" span={4}>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="large"
            prefix={<span>Prefix</span>}
            suffix={<span>Suffix</span>}
            disabled
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="middle"
            prefix={<span>Prefix</span>}
            suffix={<span>Suffix</span>}
            disabled
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus="warning">
          <Input
            placeholder="Input placeholder"
            size="small"
            prefix={<span>Prefix</span>}
            suffix={<span>Suffix</span>}
            disabled
          />
        </Form.Item>
      </Col>
    </Row>
  </div>
);

export const FormItem: Story = () => (
  <div className="form-item-board">
    <h1>Input / Form Item</h1>
    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col className="board-col" span={8}>
        <Form.Item
          label="Input Label"
          required
          tooltip="This is a tooltip"
          extra="This is a caption under a text input"
        >
          <Input placeholder="Input placeholder" size="large" />
        </Form.Item>
        <Form.Item
          label="Input Label"
          required
          tooltip="This is a tooltip"
          extra="This is a caption under a text input"
        >
          <Input placeholder="Input placeholder" size="middle" />
        </Form.Item>
        <Form.Item
          label="Input Label"
          required
          tooltip="This is a tooltip"
          extra="This is a caption under a text input"
        >
          <Input placeholder="Input placeholder" size="small" />
        </Form.Item>
      </Col>
      <Col className="board-col" span={8}>
        <Form.Item
          label="Input Label"
          requiredMark="optional"
          tooltip="This is a tooltip"
          extra="This is a caption under a text input"
        >
          <Input placeholder="Input placeholder" size="large" />
        </Form.Item>
        <Form.Item
          label="Input Label"
          requiredMark="optional"
          tooltip="This is a tooltip"
          extra="This is a caption under a text input"
        >
          <Input placeholder="Input placeholder" size="middle" />
        </Form.Item>
        <Form.Item
          label="Input Label"
          requiredMark="optional"
          tooltip="This is a tooltip"
          extra="This is a caption under a text input"
        >
          <Input placeholder="Input placeholder" size="small" />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col className="board-col" span={8}>
        <Form.Item
          label="Input Label"
          required
          tooltip="This is a tooltip"
          extra="This is a caption under a text input"
        >
          <Input placeholder="Input placeholder" size="large" disabled />
        </Form.Item>
        <Form.Item
          label="Input Label"
          required
          tooltip="This is a tooltip"
          extra="This is a caption under a text input"
        >
          <Input placeholder="Input placeholder" size="middle" disabled />
        </Form.Item>
        <Form.Item
          label="Input Label"
          required
          tooltip="This is a tooltip"
          extra="This is a caption under a text input"
        >
          <Input placeholder="Input placeholder" size="small" disabled />
        </Form.Item>
      </Col>
      <Col className="board-col" span={8}>
        <Form.Item
          label="Input Label"
          requiredMark="optional"
          tooltip="This is a tooltip"
          extra="This is a caption under a text input"
        >
          <Input placeholder="Input placeholder" size="large" disabled />
        </Form.Item>
        <Form.Item
          label="Input Label"
          requiredMark="optional"
          tooltip="This is a tooltip"
          extra="This is a caption under a text input"
        >
          <Input placeholder="Input placeholder" size="middle" disabled />
        </Form.Item>
        <Form.Item
          label="Input Label"
          requiredMark="optional"
          tooltip="This is a tooltip"
          extra="This is a caption under a text input"
        >
          <Input placeholder="Input placeholder" size="small" disabled />
        </Form.Item>
      </Col>
    </Row>
  </div>
);

export const Textarea: Story = () => (
  <div className="textarea-board">
    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col className="board-col" span={8}>
        <Input.TextArea placeholder="Textarea placeholder" size="large" />
        <Input.TextArea placeholder="Textarea placeholder" size="middle" />
        <Input.TextArea placeholder="Textarea placeholder" size="small" />
      </Col>
    </Row>
    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col className="board-col" span={8}>
        <Input.TextArea
          placeholder="Textarea placeholder"
          size="large"
          disabled
        />
        <Input.TextArea
          placeholder="Textarea placeholder"
          size="middle"
          disabled
        />
        <Input.TextArea
          placeholder="Textarea placeholder"
          size="small"
          disabled
        />
      </Col>
    </Row>
  </div>
);

export const Password: Story = () => (
  <div className="password-board">
    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col className="board-col" span={8}>
        <Input.Password placeholder="Password" size="large" />
        <Input.Password placeholder="Password" size="middle" />
        <Input.Password placeholder="Password" size="small" />
      </Col>
    </Row>
    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col className="board-col" span={8}>
        <Input.Password placeholder="Password" size="large" disabled />
        <Input.Password placeholder="Password" size="middle" disabled />
        <Input.Password placeholder="Password" size="small" disabled />
      </Col>
    </Row>
  </div>
);

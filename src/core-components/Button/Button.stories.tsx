import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Button } from './Button';
import { Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import "./Button.stories.css"

export default {
  title: 'Example/Button',
  component: Button,
} as Meta<typeof Button>;

const MiniTemplate = (args: any) => (
  <Row gutter={[{ xs: 8, sm: 16, md: 24}, 8]}>
    <Col span={8}>
      <h5>Default</h5>
    </Col>
    <Col span={8}>
      <h5>Loading</h5>
    </Col>
    <Col span={8}>
      <h5>Disabled</h5>
    </Col>
    <Col span={8}>
      <Button {...args} >Button</Button>
    </Col>
    <Col span={8}>
      <Button {...args} loading>Button</Button>
    </Col>
    <Col span={8}>
      <Button {...args} disabled>Button</Button>
    </Col>
    <Col span={8}>
      <Button {...args} icon={<SearchOutlined />}>Button</Button>
    </Col>
    <Col span={8}>
      <Button {...args} loading icon={<SearchOutlined />}>Button</Button>
    </Col>
    <Col span={8}>
      <Button {...args} disabled icon={<SearchOutlined />}>Button</Button>
    </Col>
    <Col span={8}>
      <Button {...args} icon={<SearchOutlined />}></Button>
    </Col>
    <Col span={8}>
      <Button {...args} loading icon={<SearchOutlined />}></Button>
    </Col>
    <Col span={8}>
      <Button {...args} disabled icon={<SearchOutlined />}></Button>
    </Col>
  </Row>
)

const TemplateByDanger: Story = (args: any) => (
  <>
    <h4>Danger = False</h4>
    <MiniTemplate {...args} danger={false} />
    <h4></h4>
    <h4>Danger = True</h4>
    <MiniTemplate {...args} danger={true} />
  </>
)

const TemplateBySize: Story = (args: any) => (
  <>
    <h3>Size = Large</h3>
    <TemplateByDanger {...args} size="large" />
    <h3>Size = Middle</h3>
    <TemplateByDanger {...args} size="middle" />
    <h3>Size = Small</h3>
    <TemplateByDanger {...args} size="small" />
  </>
);

const TemplateByType: Story = (args: any) => (
  <>
    <h1>Ghost = {args.ghost ? "True" : "False"}</h1>
    <h2>Type = Primary</h2>
    <TemplateBySize {...args} type="primary" />
    <h2>Type = Default</h2>
    <TemplateBySize {...args} type="default" />
    <h2>Type = Text</h2>
    <TemplateBySize {...args} type="text" />
    <h2>Type = Link</h2>
    <TemplateBySize {...args} type="link" />
    <h2>Type = Dashed</h2>
    <TemplateBySize {...args} type="dashed" />
  </>
);


export const GhostFalse: Story = () => <TemplateByType ghost={false} />;
GhostFalse.storyName = "Ghost = False";

export const GhostTrue: Story = () => <TemplateByType ghost={true} />;
GhostTrue.storyName = "Ghost = True";

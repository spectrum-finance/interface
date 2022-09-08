import { Tabs } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { CSSProperties, FC, useEffect, useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface NavigationProps {
  textCenter?: boolean;
  className?: string;
  style?: CSSProperties;
}

const _Navigation: FC<NavigationProps> = ({ className, style }) => {
  const navigate = useNavigate();
  const matchPage = useMatch<'page', string>({
    path: ':network/:page',
    end: false,
  });

  const [defaultActiveKey, setDefaultActiveKey] = useState('');

  useEffect(() => {
    setDefaultActiveKey(matchPage?.params?.page ?? '');
  }, [matchPage]);

  const onTabClick = (key: string) => navigate(key);

  return (
    <Tabs
      activeKey={defaultActiveKey}
      onChange={onTabClick}
      className={className}
      style={style}
    >
      <Tabs.TabPane tab={t`Swap`} key="swap" />
      <Tabs.TabPane tab={t`Liquidity`} key="liquidity" />
      <Tabs.TabPane tab={t`Farm`} key="farm" />
    </Tabs>
  );
};

export const Navigation = styled(_Navigation)`
  .ant-tabs-nav-list {
    height: 40px;
  }

  .ant-tabs-tab,
  .ant-tabs-nav-list {
    flex-grow: 1;
  }

  .ant-tabs-tab {
    ${(props) => props.textCenter && 'justify-content: center;'}
  }

  .ant-tabs-tab-btn {
    font-size: 16px;
    line-height: 22px;
  }
`;

import {
  Button,
  Dropdown,
  LeftOutlined,
  Menu,
  Modal,
  ReloadOutlined,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { fireAnalyticsEvent, user } from '@spectrumlabs/analytics';
import { stringify } from 'qs';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import {
  LOCALE_LABEL,
  SUPPORTED_LOCALES,
} from '../../../../../common/constants/locales';
import { useApplicationSettings } from '../../../../../context';
import { useQuery } from '../../../../../hooks/useQuery';
import { DotsIcon } from '../../../Icons/DotsIcon';
import { ManualRefundModal } from './ManualRefundModal/ManualRefundModal';

const StyledMenu = styled(Menu)`
  padding: calc(var(--spectrum-base-gutter) * 2);
  min-width: 233px;
`;

const StyledMenuBtn = styled(Button)`
  border: none;
  background: var(--spectrum-secondary-color);
  &:hover {
    border: none;
    background: var(--spectrum-secondary-color);
  }
  &.header__btn.ant-dropdown-open {
    background: var(--spectrum-primary-color);
    color: var(--spectrum-primary-text);
  }
  &.header__btn.ant-dropdown-open:hover {
    border: 1px solid var(--spectrum-primary-color-hover);
  }
`;

const OtherMenuItem = styled(Menu.Item)`
  .ant-dropdown-menu-title-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  padding: 0 calc(var(--spectrum-base-gutter) * 2);
  height: 36px;
`;

const ContributeLanguageButton = styled(Button)`
  margin-top: 8px;
  width: 100%;
`;

const BurgerMenu = (): JSX.Element => {
  const [isMainMenu, setIsMainMenu] = useState<boolean>(true);
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);
  const [settings, setSettings] = useApplicationSettings();
  const location = useLocation();
  const qs = useQuery();

  const menu = [
    {
      title: t`Manual Refund`,
      icon: <ReloadOutlined />,
      onClick: () => {
        setMenuVisible(false);
        Modal.open(({ close }) => <ManualRefundModal close={close} />);
      },
      additional: null,
      link: null as any,
    },
  ];

  const changeLanguage = (locale: string) => {
    fireAnalyticsEvent('Select Locale', { locale });
    user.set('locale_active', locale);
    setSettings({
      ...settings,
      lang: locale,
    });
  };

  const menuOthers = (
    <StyledMenu>
      {menu.map(
        (item, index) =>
          item && (
            <OtherMenuItem key={index + 1} icon={item.icon}>
              <a
                href={item.link}
                rel="noreferrer"
                target={item.link ? '_blank' : ''}
                onClick={item.onClick}
              >
                {item.title}
              </a>
              {item.additional && item.additional}
            </OtherMenuItem>
          ),
      )}
    </StyledMenu>
  );

  const menuLanguages = (
    <StyledMenu>
      <OtherMenuItem key="langs-back" icon={<LeftOutlined />}>
        <a onClick={() => setIsMainMenu(true)} rel="noopener noreferrer" />
      </OtherMenuItem>
      {SUPPORTED_LOCALES.map((locale) => {
        return (
          <OtherMenuItem key={locale}>
            <Link
              replace={true}
              to={{
                ...location,
                search: stringify({ ...qs, lng: locale }),
              }}
              rel="noopener noreferrer"
              onClick={() => {
                changeLanguage(locale);
              }}
            >
              {LOCALE_LABEL[locale]}
            </Link>
          </OtherMenuItem>
        );
      })}
      <ContributeLanguageButton
        href="https://crowdin.com/project/ergodex-frontend"
        target="_blank"
        type="primary"
        block
      >
        <Trans>Contribute</Trans>
      </ContributeLanguageButton>
    </StyledMenu>
  );

  const onMenuVisibleChange = (flag: boolean) => {
    setMenuVisible(flag);
    if (flag) {
      setIsMainMenu(true);
    }
  };

  return (
    <Dropdown
      overlay={isMainMenu ? menuOthers : menuLanguages}
      trigger={['click']}
      visible={isMenuVisible}
      onVisibleChange={onMenuVisibleChange}
    >
      <StyledMenuBtn className="header__btn" size="large" icon={<DotsIcon />} />
    </Dropdown>
  );
};

export { BurgerMenu };

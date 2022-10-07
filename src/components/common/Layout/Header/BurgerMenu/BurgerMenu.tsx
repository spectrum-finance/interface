import './BurgerMenu.less';

import {
  Button,
  Dropdown,
  FileTextOutlined,
  GithubOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  Menu,
  Modal,
  QuestionCircleOutlined,
  ReloadOutlined,
  RightOutlined,
  SettingOutlined,
  useDevice,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { stringify } from 'qs';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { ReactComponent as DarkModeOutlined } from '../../../../../assets/icons/darkmode.svg';
import { panalytics } from '../../../../../common/analytics';
import {
  LOCALE_LABEL,
  SUPPORTED_LOCALES,
} from '../../../../../common/constants/locales';
import { useObservable } from '../../../../../common/hooks/useObservable';
import { useApplicationSettings } from '../../../../../context';
import { useSelectedNetwork } from '../../../../../gateway/common/network';
import { globalSettingsModal$ } from '../../../../../gateway/widgets/globalSettingsModal';
import { useQuery } from '../../../../../hooks/useQuery';
import { ErgopaySwitch } from '../../../../../network/ergo/widgets/ErgopaySwitch/ErgopaySwitch';
import { ThemeSwitch } from '../../../../ThemeSwitch/ThemeSwitch';
import { DotsIcon } from '../../../Icons/DotsIcon';
import { ManualRefundModal } from './ManualRefundModal/ManualRefundModal';

const MENU_WIDTH = 160;

const ContributeLanguageButton = styled(Button)`
  width: 140px;
  margin: 0 10px;
`;

const BurgerMenu = (): JSX.Element => {
  const [selectedNetwork] = useSelectedNetwork();
  const [GlobalSettingsModal] = useObservable(globalSettingsModal$);
  const { s } = useDevice();
  const [isMainMenu, setIsMainMenu] = useState<boolean>(true);
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);
  const [settings, setSettings] = useApplicationSettings();
  const location = useLocation();
  const qs = useQuery();

  const menu = [
    {
      title: t`About`,
      icon: <InfoCircleOutlined />,
      link: 'https://docs.spectrum.fi/docs/about-spectrumdex/intro',
      onClick: () => panalytics.clickBurgerMenu('About'),
    },
    {
      title: t`How to use`,
      icon: <QuestionCircleOutlined />,
      link: 'https://docs.spectrum.fi/docs/user-guides/quick-start',
      onClick: () => panalytics.clickBurgerMenu('How to use'),
    },
    {
      title: t`Docs`,
      icon: <FileTextOutlined />,
      link: 'https://docs.spectrum.fi',
      onClick: () => panalytics.clickBurgerMenu('Docs'),
    },
    {
      title: 'GitHub',
      icon: <GithubOutlined />,
      link: 'https://github.com/ergolabs',
      onClick: () => panalytics.clickBurgerMenu('GitHub'),
    },
    selectedNetwork.name === 'ergo'
      ? {
          title: t`Manual Refund`,
          icon: <ReloadOutlined />,
          onClick: () => {
            panalytics.clickBurgerMenu('Manual Refund');
            Modal.open(({ close }) => <ManualRefundModal close={close} />);
          },
        }
      : undefined,
    GlobalSettingsModal
      ? {
          title: t`Global Settings`,
          icon: <SettingOutlined />,
          onClick: () => {
            panalytics.clickBurgerMenu('Global Settings');
            Modal.open(({ close }) => <GlobalSettingsModal onClose={close} />);
          },
          isNotRenderMobile: true,
        }
      : undefined,
    {
      title: t`Language`,
      icon: <GlobalOutlined />,
      additional: <RightOutlined style={{ marginLeft: 36 }} />,
      onClick: () => {
        panalytics.clickBurgerMenu('Language');
        setIsMainMenu(false);
      },
    },
    {
      title: t`Dark mode`,
      icon: <DarkModeOutlined />,
      additional: <ThemeSwitch defaultChecked size="small" />,
    },
    {
      title: t`Ergopay`,
      icon: <DarkModeOutlined />,
      additional: <ErgopaySwitch defaultChecked size="small" />,
    },
  ];

  const changeLanguage = (locale: string) => {
    setSettings({
      ...settings,
      lang: locale,
    });
  };

  const menuOthers = (
    <Menu style={{ minWidth: MENU_WIDTH }}>
      {menu.map(
        (item, index) =>
          item && (
            <Menu.Item
              className="ergodex-menu-item"
              key={index + 1}
              icon={item.icon}
              style={{
                display: s && item.isNotRenderMobile ? 'none' : '',
              }}
            >
              <a
                href={item.link}
                rel="noreferrer"
                target={item.link ? '_blank' : ''}
                onClick={item.onClick}
              >
                {item.title}
              </a>
              {item.additional && item.additional}
            </Menu.Item>
          ),
      )}
    </Menu>
  );

  const menuLanguages = (
    <Menu
      style={{
        minWidth: MENU_WIDTH,
      }}
    >
      <Menu.Item key="langs-back" icon={<LeftOutlined />}>
        <a onClick={() => setIsMainMenu(true)} rel="noopener noreferrer" />
      </Menu.Item>
      {SUPPORTED_LOCALES.map((locale) => {
        return (
          <Menu.Item key={locale}>
            <Link
              replace={true}
              to={{
                ...location,
                search: stringify({ ...qs, lng: locale }),
              }}
              rel="noopener noreferrer"
              onClick={() => {
                changeLanguage(locale);
                panalytics.changeLocate(locale);
              }}
            >
              {LOCALE_LABEL[locale]}
            </Link>
          </Menu.Item>
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
    </Menu>
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
      <Button className="header__btn" size="large" icon={<DotsIcon />} />
    </Dropdown>
  );
};

export { BurgerMenu };

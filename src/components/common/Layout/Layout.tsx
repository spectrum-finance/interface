import './Layout.less';

import React, { useEffect } from 'react';

import { useAppLoadingState, useSettings } from '../../../context';
import { Button, Modal, QuestionCircleOutlined } from '../../../ergodex-cdk';
import { useBodyClass } from '../../../hooks/useBodyClass';
import { Header } from '../../Header/Header';
import { HowToUseModal } from '../../HowToUseModal/HowToUseModal';
import { KyaModal } from '../KyaModal/KyaModal';

interface Props {
  children: React.ReactChild | React.ReactChild[];
}

const Layout = ({ children }: Props): JSX.Element => {
  const [{ theme }] = useSettings();
  useBodyClass(theme);

  const [{ isKYAAccepted }] = useAppLoadingState();

  useEffect(() => {
    if (!isKYAAccepted) {
      Modal.open(({ close }) => <KyaModal onClose={close} />);
    }
  }, [isKYAAccepted]);

  const handleOpenHowToUseModal = () => {
    Modal.open(({ close }) => <HowToUseModal onClose={close} />, {
      title: 'How to use ErgoDEX?',
    });
  };

  return (
    <div className="layout">
      <Header />
      <main>{children}</main>
      <Button
        className="how-to-use-btn"
        type="primary"
        size="extra-large"
        icon={<QuestionCircleOutlined />}
        onClick={handleOpenHowToUseModal}
      >
        How to use ErgoDEX?
      </Button>
    </div>
  );
};

export default Layout;

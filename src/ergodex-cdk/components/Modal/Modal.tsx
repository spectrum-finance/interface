import './Modal.less';

import { Modal as BaseModal } from 'antd';
import React, { PropsWithChildren, ReactElement } from 'react';
import { ReactNode } from 'react';
import ReactDOM from 'react-dom';

import { useDevice } from '../../../hooks/useDevice';
import { BaseMobileModal } from './BaseMobileModal';
import { ModalContent } from './ModalContent/ModalContent';
import {
  ModalInnerTitle,
  ModalTitle,
  ModalTitleContextProvider,
} from './ModalTitle/ModalTitle';
import { Error } from './presets/Error';
import { Progress } from './presets/Progress';
import { Request, RequestProps } from './presets/Request';
import { Success } from './presets/Success';
import { Warning } from './presets/Warning';

interface ModalFactoryProps {
  visible: boolean;
  params: any;
  onCancel: () => void;
  close: (result?: any) => void;
  afterClose: () => void;
  afterOpen: () => void;
  content: ReactNode;
}

const ModalFactory: React.FC<ModalFactoryProps> = ({
  visible,
  params,
  onCancel,
  close,
  afterClose,
  afterOpen,
  content,
}) => {
  const { s } = useDevice();
  return (
    <ModalTitleContextProvider>
      {!s && (
        <BaseModal
          width={params.width}
          visible={visible}
          onCancel={onCancel}
          footer={params.footer}
          title={<ModalInnerTitle />}
          afterClose={afterClose}
          closable={params.closable}
        >
          <>
            {visible && afterOpen()}
            {content instanceof Function ? content({ close }) : content}
          </>
        </BaseModal>
      )}
      {s && (
        <BaseMobileModal
          visible={visible}
          onClose={onCancel}
          title={<ModalInnerTitle />}
          footer={params.footer}
          afterClose={afterClose}
          closable={params.closable}
        >
          <>
            {visible && afterOpen()}
            {content instanceof Function ? content({ close }) : content}
          </>
        </BaseMobileModal>
      )}
    </ModalTitleContextProvider>
  );
};

export interface ModalParams<R = any> {
  readonly title?: ReactNode | ReactNode[] | string | null;
  readonly footer?: ReactNode | ReactNode[] | string | null;
  readonly afterOpen?: () => void;
  readonly afterClose?: (result: R) => void;
  readonly width?: number;
  readonly closable?: boolean;
}

export interface ModalRef<T = any> {
  close: (result?: T) => void;
}

let dialogId = 0;

interface ModalProvider {
  openDialog: (
    content:
      | ReactNode
      | ReactNode[]
      | ((dialogRef: ModalRef) => ReactNode | ReactNode[] | string),
    params?: ModalParams,
  ) => ModalRef;
}

class BaseModalProvider implements ModalProvider {
  private defaultParams: ModalParams = {
    title: '',
    footer: '',
    afterOpen: undefined,
    afterClose: undefined,
  };

  private modalRootElement = document.createElement('div');

  openDialog(
    content:
      | ReactNode
      | ReactNode[]
      | ((dialogRef: ModalRef) => ReactNode | ReactNode[] | string),
    params: ModalParams = this.defaultParams,
  ): ModalRef {
    const dialogId = this.createDialogId();
    const container = this.createContainer(dialogId);

    this.modalRootElement.appendChild(container);
    params = { ...this.defaultParams, ...params };
    let dialogResult: any = undefined;
    let destroyed = false;
    const afterClose = () => {
      ReactDOM.unmountComponentAtNode(container);

      if (params.afterClose) {
        params.afterClose(dialogResult);
      }
    };
    const afterOpen = () => {
      if (params.afterOpen) {
        params.afterOpen();
      }
    };
    const close = (result: any) => {
      if (destroyed) {
        return;
      }
      dialogResult = result;
      ReactDOM.render(modalFactory(false), container);
    };
    const onCancel = () => {
      destroyed = true;
      ReactDOM.render(modalFactory(false), container);
    };

    const modalFactory = (visible: boolean) => (
      <ModalFactory
        key={dialogId}
        visible={visible}
        params={params}
        onCancel={onCancel}
        afterClose={afterClose}
        afterOpen={afterOpen}
        content={content}
        close={close}
      />
    );

    ReactDOM.render(modalFactory(true), container);

    return { close };
  }

  private createContainer(dialogId: number): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add(`ergo-dialog-${dialogId++}`);

    return container;
  }

  private createDialogId() {
    return dialogId++;
  }
}

export const Modal = {
  Title: ModalTitle,
  Content: ModalContent,
  provider: new BaseModalProvider() as ModalProvider,
  open(
    content:
      | ReactNode
      | ReactNode[]
      | ((dialogRef: ModalRef) => ReactNode | ReactNode[] | string),
    params?: ModalParams,
  ): ModalRef {
    return this.provider.openDialog(content, params);
  },
  progress(content: ReactNode | ReactNode[] | string): ModalRef {
    return this.open(<Progress content={content} />, { width: 343 });
  },
  error(content: ReactNode | ReactNode[] | string): ModalRef {
    return this.open(<Error content={content} />, { width: 343 });
  },
  warning(content: ReactNode | ReactNode[] | string): ModalRef {
    return this.open(<Warning content={content} />, { width: 343 });
  },
  success(content: ReactNode | ReactNode[] | string): ModalRef {
    return this.open(<Success content={content} />, { width: 343 });
  },
  request(config: RequestProps): ModalRef {
    return this.open(<Request {...config} />);
  },
};

class Portal extends React.Component<{ root: HTMLElement }> {
  private element = document.createElement('div');

  componentDidMount = () => {
    this.props.root.appendChild(this.element);
  };
  componentWillUnmount = () => {
    this.props.root.removeChild(this.element);
  };

  render() {
    const { children } = this.props;
    return ReactDOM.createPortal(children, this.element);
  }
}

interface ModalProviderProps {
  rootElement?: string | HTMLElement;
}

export class ContextModalProvider
  extends React.Component<PropsWithChildren<ModalProviderProps>>
  implements ModalProvider
{
  private defaultParams: ModalParams = {
    title: '',
    footer: '',
    afterOpen: undefined,
    afterClose: undefined,
  };

  private modals = new Map<number, ReactElement>();

  componentDidMount(): void {
    Modal.provider = this;
  }

  componentWillUnmount(): void {
    Modal.provider = new BaseModalProvider();
  }

  openDialog(
    content:
      | React.ReactNode
      | React.ReactNode[]
      | ((dialogRef: ModalRef) => React.ReactNode | React.ReactNode[] | string),
    params: ModalParams = this.defaultParams,
  ): ModalRef {
    const dialogId = this.createDialogId();
    params = { ...this.defaultParams, ...params };
    let dialogResult: any = undefined;

    let destroyed = false;
    const afterClose = () => {
      this.modals.delete(dialogId);

      if (params.afterClose) {
        params.afterClose(dialogResult);
      }
    };
    const afterOpen = () => {
      if (params.afterOpen) {
        params.afterOpen();
      }
    };
    const close = (result: any) => {
      if (destroyed) {
        return;
      }
      dialogResult = result;
      this.modals.set(dialogId, modalFactory(false));
      this.forceUpdate();
    };
    const onCancel = () => {
      destroyed = true;
      this.modals.set(dialogId, modalFactory(false));
      this.forceUpdate();
    };

    const modalFactory = (visible: boolean) => (
      <ModalFactory
        key={dialogId}
        visible={visible}
        params={params}
        close={close}
        onCancel={onCancel}
        afterClose={afterClose}
        afterOpen={afterOpen}
        content={content}
      />
    );

    this.modals.set(dialogId, modalFactory(true));
    this.forceUpdate();

    return { close };
  }

  render(): ReactNode | ReactNode[] | string {
    return (
      <>
        {Array.from(this.modals.entries()).map(([key, modal]) => (
          <Portal root={document.body} key={`portal-${key}`}>
            {modal}
          </Portal>
        ))}
        {this.props.children}
      </>
    );
  }

  private createDialogId(): number {
    return dialogId++;
  }
}

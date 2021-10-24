import './Modal.less';

import { Modal as BaseModal, Typography } from 'antd';
import React, { ReactElement } from 'react';
import { ReactNode } from 'react';
import ReactDOM from 'react-dom';

import { Error } from './presets/Error';
import { Progress } from './presets/Progress';
import { Request, RequestProps } from './presets/Request';
import { Success } from './presets/Success';
import { Warning } from './presets/Warning';

export interface ModalParams<R = any> {
  readonly title?: ReactNode | ReactNode[] | string | null;
  readonly footer?: ReactNode | ReactNode[] | string | null;
  readonly afterOpen?: () => void;
  readonly afterClose?: (result: R) => void;
  readonly width?: number;
}

interface DialogRef<T = any> {
  close: (result?: T) => void;
}

let dialogId = 0;

class ModalKlass {
  private defaultParams: ModalParams = {
    title: '',
    footer: '',
    afterOpen: undefined,
    afterClose: undefined,
  };

  private modalRootElement = document.createElement('div');

  constructor() {
    window.document.body.appendChild(this.modalRootElement);
  }

  open(
    content:
      | ReactNode
      | ReactNode[]
      | ((dialogRef: DialogRef) => ReactNode | ReactNode[] | string),
    params: ModalParams = this.defaultParams,
  ): DialogRef {
    const dialogId = this.createDialogId();
    const container = this.createContainer(dialogId);

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

    const modalFactory = (visible: boolean) => {
      return (
        <BaseModal
          key={dialogId}
          width={params.width}
          visible={visible}
          onCancel={onCancel}
          footer={params.footer}
          title={
            <Typography.Title level={4}>{params.title || ''}</Typography.Title>
          }
          afterClose={afterClose}
        >
          <>
            {visible && afterOpen()}
            {content instanceof Function ? content({ close }) : content}
          </>
        </BaseModal>
      );
    };

    ReactDOM.render(modalFactory(true), container);

    return { close };
  }

  progress(content: ReactNode | ReactNode[] | string): DialogRef {
    return this.open(<Progress content={content} />, { width: 343 });
  }

  error(content: ReactNode | ReactNode[] | string): DialogRef {
    return this.open(<Error content={content} />, { width: 343 });
  }

  warning(content: ReactNode | ReactNode[] | string): DialogRef {
    return this.open(<Warning content={content} />, { width: 343 });
  }

  success(content: ReactNode | ReactNode[] | string): DialogRef {
    return this.open(<Success content={content} />, { width: 343 });
  }

  request(config: RequestProps): DialogRef {
    return this.open(<Request {...config} />, { width: 343 });
  }

  private isContentReactElement(content: any): content is ReactElement {
    return !!content.props;
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

export const Modal = new ModalKlass();

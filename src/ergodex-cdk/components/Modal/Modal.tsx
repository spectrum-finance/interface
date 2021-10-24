import './Modal.less';

import { Modal as BaseModal } from 'antd';
import React, { FC } from 'react';
import { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps<P> {
  readonly props?: P;
}

export interface ModalParams {
  readonly title?: ReactNode | ReactNode[] | null;
  readonly footer?: ReactNode | ReactNode[] | null;
  readonly afterOpen?: (modal: typeof BaseModal) => void;
  readonly afterClose?: (modal: typeof BaseModal) => void;
}

export type ModalFC<T, R> = FC<T> & { close: (result?: R) => void };

let dialogId = 0;

class ModalKlass {
  private defaultParams: ModalParams = {
    title: null,
    footer: null,
    afterOpen: undefined,
    afterClose: undefined,
  };

  private modalRootElement = document.createElement('div');

  constructor() {
    window.document.body.appendChild(this.modalRootElement);
  }

  open<P = any>(content: FC<P>, params?: ModalParams & ModalProps<P>): void;
  open(content: ReactNode | ReactNode[] | FC, params?: ModalParams): void;
  open(
    Content: ReactNode | ReactNode[] | FC,
    params: ModalParams & ModalProps<any> = this.defaultParams,
  ) {
    const container = this.createContainer();
    const config = { visible: true };
    const onCancel = () => {
      config.visible = false;
      const modal = (
        <BaseModal {...config} onCancel={onCancel}>
          {Content instanceof Function ? (
            <Content {...(params.props || {})} />
          ) : (
            Content
          )}
        </BaseModal>
      );
      ReactDOM.render(modal, container);
    };
    const modal = (
      <BaseModal {...config} onCancel={onCancel}>
        {Content instanceof Function ? (
          <Content {...(params.props || {})} />
        ) : (
          Content
        )}
      </BaseModal>
    );

    ReactDOM.render(modal, container);
  }

  private createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add(`ergo-dialog-${dialogId++}`);

    return container;
  }
}

export const Modal = new ModalKlass();

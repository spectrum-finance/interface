import { message } from 'antd';

interface DefaultMessageConfig {
  className: string;
  duration: number;
}

interface MessageType extends PromiseLike<any> {
  (): void;
}

const defaultConfig: DefaultMessageConfig = {
  className: 'ergodex-message',
  duration: 2,
};

const m = {
  success(content: string): MessageType {
    return message.success({ ...defaultConfig, content });
  },
  error(content: string): MessageType {
    return message.error({ ...defaultConfig, content });
  },
  warning(content: string): MessageType {
    return message.warning({ ...defaultConfig, content });
  },
  loading(content: string): MessageType {
    return message.loading({ ...defaultConfig, content });
  },
  info(content: string): MessageType {
    return message.info({ ...defaultConfig, content });
  },
};

export { m as message };

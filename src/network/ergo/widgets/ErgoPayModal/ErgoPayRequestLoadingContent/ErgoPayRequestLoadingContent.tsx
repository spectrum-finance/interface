import { LoadingDataState, Modal } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

export const ErgoPayRequestLoadingContent: FC = () => (
  <>
    <Modal.Title>ErgoPay request</Modal.Title>
    <Modal.Content width={480}>
      <LoadingDataState height={200}>
        <Trans>Preparing ergoPay request.</Trans>
        <br />
        <Trans>Please wait.</Trans>
      </LoadingDataState>
    </Modal.Content>
  </>
);

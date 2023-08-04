import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { useObservable } from '../../../../../../../../common/hooks/useObservable';
import { Address } from '../../../../../../../../common/types';
import { selectedWallet$ } from '../../../../../../../../gateway/api/wallets';
import { useHasActiveAdaHandleOnBalance } from '../../../../../../../../network/cardano/api/adaHandle';
import { ActiveAdaHandle } from '../../../../../../../../network/cardano/widgets/AdaHandle/ActiveAdaHandle/ActiveAdaHandle.tsx';
import { isCardano } from '../../../../../../../../utils/network.ts';
import { getShortAddress } from '../../../../../../../../utils/string/addres';
import { SensitiveContent } from '../../../../../../../SensitiveContent/SensitiveContent.tsx';
import { TagTypography } from '../TagTypography/TagTypography';

export interface AddressContentProps {
  readonly address?: Address;
  readonly className?: string;
}

export const AddressContent: FC<AddressContentProps> = ({ address }) => {
  const addressToRender = address ? getShortAddress(address) : '';
  const [selectedWallet] = useObservable(selectedWallet$);
  const [hasActiveAdaHandleOnBalance] = useHasActiveAdaHandleOnBalance();

  return (
    <Flex align="center">
      <Flex.Item align="center" marginRight={1}>
        {selectedWallet?.previewIcon}
      </Flex.Item>
      {hasActiveAdaHandleOnBalance && isCardano() ? (
        <ActiveAdaHandle small />
      ) : (
        <SensitiveContent>
          <TagTypography>{addressToRender}</TagTypography>
        </SensitiveContent>
      )}
    </Flex>
  );
};

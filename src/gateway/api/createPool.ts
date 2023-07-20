import { applicationConfig } from '../../applicationConfig';
import { useSelectedNetwork } from '../common/network';

export const useCreatePoolAvailable = (): boolean => {
  const [selectedNetwork] = useSelectedNetwork();

  return applicationConfig.networksSettings[selectedNetwork.name]
    .isCreatePoolAvailable;
};

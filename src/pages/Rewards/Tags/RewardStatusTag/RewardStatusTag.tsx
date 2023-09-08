import { CheckCircleOutlined, SyncOutlined, Tag } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';

export const RewardStatusTag = ({ status }) => {
  if (status === 'ongoing') {
    return (
      <Tag color="processing" icon={<SyncOutlined />}>
        {status == 'ongoing' ? 'Ongoing' : 'Finished'}
      </Tag>
    );
  }

  return (
    <Tag color="success" icon={<CheckCircleOutlined />}>
      <Trans>Finished</Trans>
    </Tag>
  );
};

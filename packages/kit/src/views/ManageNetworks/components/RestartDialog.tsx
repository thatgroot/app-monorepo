import React, { FC, useCallback } from 'react';

import { useIntl } from 'react-intl';

import { Dialog } from '@onekeyhq/components';

type Props = {
  onClose?: () => void;
  onConfirm?: () => void;
};

const RestartAppDialog: FC<Props> = ({ onClose, onConfirm }) => {
  const intl = useIntl();

  const restart = useCallback(() => {
    onClose?.();
    onConfirm?.();
  }, [onClose, onConfirm]);

  return (
    <Dialog
      visible
      hasFormInsideDialog
      contentProps={{
        title: intl.formatMessage({ id: 'dialog__restart_required' }),
        content: intl.formatMessage({
          id: 'dialog__restart_required_desc',
        }),
      }}
      footerButtonProps={{
        primaryActionTranslationId: 'action__restart',
        primaryActionProps: {
          type: 'primary',
        },
        onPrimaryActionPress: restart,
        onSecondaryActionPress: onClose,
      }}
    />
  );
};

export default RestartAppDialog;
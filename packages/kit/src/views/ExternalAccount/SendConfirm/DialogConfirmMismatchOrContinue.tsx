import { useMemo } from 'react';

import { useIntl } from 'react-intl';

import {
  Alert,
  Dialog,
  HStack,
  Image,
  Text,
  VStack,
} from '@onekeyhq/components';
import { shortenAddress } from '@onekeyhq/components/src/utils';
import { IMPL_EVM } from '@onekeyhq/engine/src/constants';
import { IBaseExternalAccountInfo } from '@onekeyhq/engine/src/dbs/simple/entity/SimpleDbEntityWalletConnect';
import { generateNetworkIdByChainId } from '@onekeyhq/engine/src/managers/network';
import { Account } from '@onekeyhq/engine/src/types/account';
import { Network } from '@onekeyhq/engine/src/types/network';
import debugLogger from '@onekeyhq/shared/src/logger/debugLogger';

import LogoOneKey from '../../../../assets/onboarding/logo_onekey.png';
import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';
import { usePromiseResult } from '../../../hooks/usePromiseResult';
import ExternalAccountImg from '../components/ExternalAccountImg';

export interface IDialogConfirmMismatchContinueInfo {
  myAddress: string;
  // eslint-disable-next-line react/no-unused-prop-types
  myChainId: string;
  peerAddress: string;
  peerChainId: string;
  accountInfo?: IBaseExternalAccountInfo | undefined;
  currentAccount: Account;
  currentNetwork: Network;
  isAddressMismatched: boolean;
  isChainMismatched: boolean;
}

export interface IDialogConfirmMismatchContinueProps
  extends IDialogConfirmMismatchContinueInfo {
  onClose?: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}
export function DialogConfirmMismatchOrContinue(
  props: IDialogConfirmMismatchContinueProps,
) {
  const intl = useIntl();
  const {
    onClose,
    onCancel,
    onSubmit,
    peerAddress,
    myAddress,
    peerChainId,
    // myChainId,
    accountInfo,
    currentAccount,
    currentNetwork,
    isAddressMismatched,
    isChainMismatched,
  } = props;
  const { engine } = backgroundApiProxy;
  const { result: peerNetwork } = usePromiseResult(async () => {
    try {
      const networkId = generateNetworkIdByChainId({
        impl: IMPL_EVM,
        chainId: peerChainId,
      });
      return await engine.getNetwork(networkId);
    } catch (error) {
      debugLogger.common.error(error);
      return undefined;
    }
  }, [peerChainId]);
  const msgId = useMemo(() => {
    if (isAddressMismatched && isChainMismatched) {
      return 'content__account_and_network_not_matched';
    }
    if (isAddressMismatched) {
      return 'content__account_is_not_matched';
    }
    if (isChainMismatched) {
      return 'content__chain_is_not_matched';
    }
  }, [isAddressMismatched, isChainMismatched]);
  return (
    <Dialog
      visible
      onClose={() => {
        onClose?.();
      }}
      contentProps={{
        // title: intl.formatMessage({ id: 'action__remove_account' }),
        // content: ''
        contentElement: (
          <VStack space={6} alignSelf="stretch">
            <Alert
              title={intl.formatMessage({
                id: msgId,
              })}
              alertType="info"
              dismiss={false}
            />
            <VStack>
              <HStack>
                <Image source={LogoOneKey} borderRadius="6px" size={6} />
                <Text typography="Body1Strong" ml={3}>
                  OneKey
                </Text>
              </HStack>
              <HStack justifyContent="space-between" py={3}>
                <Text typography="Body2Strong" color="text-subdued">
                  {intl.formatMessage({ id: 'form__account' })}
                </Text>
                <Text typography="Body2">{shortenAddress(myAddress)}</Text>
              </HStack>
              <HStack justifyContent="space-between" py={3}>
                <Text typography="Body2Strong" color="text-subdued">
                  {intl.formatMessage({ id: 'network__network' })}
                </Text>
                <Text typography="Body2">{currentNetwork.shortName}</Text>
              </HStack>
            </VStack>
            <VStack>
              <HStack>
                <ExternalAccountImg
                  accountId={currentAccount.id}
                  size={6}
                  radius="6px"
                />
                <Text typography="Body1Strong" ml={3}>
                  {accountInfo?.walletName || '3rd Wallet'}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" py={3}>
                <Text typography="Body2Strong" color="text-subdued">
                  {intl.formatMessage({ id: 'form__account' })}
                </Text>
                <Text
                  typography="Body2"
                  color={isAddressMismatched ? 'text-critical' : 'text-default'}
                >
                  {shortenAddress(peerAddress)}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" py={3}>
                <Text typography="Body2Strong" color="text-subdued">
                  {intl.formatMessage({ id: 'network__network' })}
                </Text>
                <Text
                  typography="Body2"
                  color={isChainMismatched ? 'text-critical' : 'text-default'}
                >
                  {peerNetwork?.shortName ||
                    (peerChainId ? `chainId=${peerChainId}` : '')}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        ),
      }}
      footerButtonProps={{
        primaryActionProps: {
          type: 'primary',
        },
        primaryActionTranslationId: 'action__continue',
        onPrimaryActionPress: () => {
          onSubmit();
          onClose?.();
        },
        onSecondaryActionPress: () => {
          onCancel();
          onClose?.();
        },
      }}
    />
  );
}
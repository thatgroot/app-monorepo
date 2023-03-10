import { useEffect } from 'react';

import {
  DrawerContentScrollView,
  useDrawerStatus,
} from '@react-navigation/drawer';

import { useIsVerticalLayout } from '@onekeyhq/components';

import backgroundApiProxy from '../../background/instance/backgroundApiProxy';
import reducerAccountSelector from '../../store/reducers/reducerAccountSelector';

import WalletSelectorChildren from './WalletSelectorChildren';

import type { DrawerContentComponentProps } from '@react-navigation/drawer';

const { updateMobileWalletSelectorDrawerOpen } = reducerAccountSelector.actions;
function WalletSelectorMobile(props: DrawerContentComponentProps) {
  const isVerticalLayout = useIsVerticalLayout();

  const { dispatch } = backgroundApiProxy;
  const drawerStatus = useDrawerStatus();
  const isDrawerOpen = drawerStatus === 'open';

  useEffect(() => {
    dispatch(updateMobileWalletSelectorDrawerOpen(isDrawerOpen));
  }, [dispatch, isDrawerOpen]);

  if (!isVerticalLayout) {
    return null;
  }

  // accountSelectorInfo, isOpen
  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled={false}
      contentContainerStyle={{ flexDirection: 'row', flex: 1 }}
    >
      {/* AccountSelectorMobile */}
      <WalletSelectorChildren />
    </DrawerContentScrollView>
  );
}

export { WalletSelectorMobile };

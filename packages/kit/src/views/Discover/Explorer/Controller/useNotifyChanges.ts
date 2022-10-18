import { useEffect, useMemo } from 'react';

import { IElectronWebView } from '@onekeyfe/cross-inpage-provider-types';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { throttle } from 'lodash';

import debugLogger from '@onekeyhq/shared/src/logger/debugLogger';
import platformEnv from '@onekeyhq/shared/src/platformEnv';

import backgroundApiProxy from '../../../../background/instance/backgroundApiProxy';
import { useIsMounted } from '../../../../hooks/useIsMounted';
import { webviewRefs } from '../explorerUtils';

import { useWebTab } from './useWebTabs';

const notifyChanges = throttle(
  (url: string, fromScene?: string) => {
    debugLogger.webview.info('webview notify changed events', url, fromScene);
    backgroundApiProxy.serviceAccount.notifyAccountsChanged();
    backgroundApiProxy.serviceNetwork.notifyChainChanged();
  },
  150,
  {
    leading: false,
    trailing: true,
  },
);

export const useNotifyChanges = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const isFocusedInDiscoverTab = useMemo(() => {
    let $isFocused = isFocused;
    if (!isFocused) {
      // getFocusedRouteNameFromRoute(route)
      let tabNav = navigation;
      if (tabNav.getState().type !== 'tab') {
        tabNav = navigation.getParent();
      }
      const { routeNames, index: navIndex } = tabNav.getState();
      $isFocused = (routeNames[navIndex] as string) === 'discover';
    }
    return $isFocused;
  }, [isFocused, navigation]);

  const isMountedRef = useIsMounted();
  const tab = useWebTab();
  const ref = tab ? webviewRefs[tab.id] : null;
  const tabUrl = tab?.url;

  useEffect(() => {
    if (!isMountedRef.current) {
      return;
    }
    if (!tabUrl || !isFocusedInDiscoverTab) {
      return;
    }
    if (!ref) {
      return;
    }
    const { jsBridge } = ref;
    if (jsBridge) {
      // only enable message for current focused webview
      jsBridge.globalOnMessageEnabled = true;
    } else {
      return;
    }
    debugLogger.webview.info('webview isFocused and connectBridge', tabUrl);
    // connect background jsBridge
    backgroundApiProxy.connectBridge(jsBridge);

    if (platformEnv.isNative) {
      notifyChanges(tabUrl, 'immediately');
    } else {
      const innerRef = ref.innerRef as IElectronWebView;
      // @ts-ignore
      if (innerRef.__domReady) {
        notifyChanges(tabUrl, 'immediately');
      } else {
        let isNotifiedWhenDomReady = false;
        const onDomReady = () => {
          notifyChanges(tabUrl, 'domReady');
          isNotifiedWhenDomReady = true;
        };
        innerRef.addEventListener('dom-ready', onDomReady);

        const timer = setTimeout(() => {
          if (!isNotifiedWhenDomReady) {
            notifyChanges(tabUrl, 'setTimeout');
          }
        }, 1500);
        return () => {
          clearTimeout(timer);
          innerRef.removeEventListener('dom-ready', onDomReady);
        };
      }
    }
  }, [navigation, isFocusedInDiscoverTab, isMountedRef, tabUrl, ref]);
};